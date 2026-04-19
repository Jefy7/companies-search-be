import { Injectable } from '@nestjs/common';
import { DbService } from '@lib/db';
import { LoggerService } from '@lib/logger';
import { AiService } from './ai/ai.service';
import { CacheService } from '@lib/cache';

export interface SearchCompaniesParams {
  query?: string;
  sector?: string;
  subSector?: string;
  location?: string;
  page: number;
  limit: number;
}

export interface SearchCompaniesResponse {
  data: Awaited<ReturnType<DbService['search']>>['data'];
  total: number;
  page: number;
  limit: number;
  aiSuggestions?: string[];
}

@Injectable()
export class AppCompanyService {
  private static readonly AI_CONFIDENCE_THRESHOLD = 0.7;

  constructor(
    private readonly dbService: DbService,
    private readonly aiService: AiService,
    private readonly loggerService: LoggerService,
    private readonly cacheService: CacheService, // ✅ INJECT
  ) { }

  /**
   * 🔥 Build stable cache key
   */
  private buildCacheKey(params: SearchCompaniesParams) {
    return `search:${JSON.stringify({
      q: params.query?.toLowerCase() || '',
      s: params.sector || '',
      ss: params.subSector || '',
      l: params.location || '',
      p: params.page,
      lim: params.limit,
    })}`;
  }

  async searchCompanies(
    params: SearchCompaniesParams,
  ): Promise<SearchCompaniesResponse> {
    this.loggerService.info('params', 'input', { params });

    const cacheKey = this.buildCacheKey(params);

    // ✅ CACHE WRAP
    return this.cacheService.wrap<SearchCompaniesResponse>(
      cacheKey,
      async () => {
        this.loggerService.info('CACHE MISS', 'AppCompanyService', {
          cacheKey,
        });

        let aiResult = null;

        // 🔥 Call AI only if query exists
        if (params.query) {
          aiResult = await this.aiService.enhanceSearch(params.query);
        }

        this.loggerService.info('AI Result', 'AppCompanyService', {
          aiResult,
        });

        const canApplyAi =
          aiResult !== null &&
          aiResult.confidence >=
          AppCompanyService.AI_CONFIDENCE_THRESHOLD;

        const mergedFilters = {
          sector:
            params.sector ??
            (canApplyAi ? aiResult?.filters.sector : undefined),

          subSector:
            params.subSector ??
            (canApplyAi ? aiResult?.filters.subSector : undefined),

          location:
            params.location ??
            (canApplyAi ? aiResult?.filters.location : undefined),

          tags: canApplyAi ? aiResult?.filters.tags ?? [] : [],
        };

        const similarTerms = canApplyAi
          ? aiResult?.similarTerms
          : [];

        this.loggerService.info(
          'mergedFilters',
          'AppCompanyService',
          { mergedFilters },
        );

        const result = await this.dbService.search(
          mergedFilters,
          { page: params.page, limit: params.limit },
          params.query,
          similarTerms,
        );

        const response: SearchCompaniesResponse = {
          ...result,
          aiSuggestions: canApplyAi
            ? aiResult?.suggestions
            : [],
        };

        // ✅ Avoid caching empty results (optional)
        if (!response.data || response.data.length === 0) {
          this.loggerService.warn(
            'Skipping cache (empty result)',
            'AppCompanyService',
          );
          return response;
        }

        return response;
      },
      120_000, // ⏱ 2 min TTL
    );
  }

}