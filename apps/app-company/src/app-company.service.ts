import { Injectable } from '@nestjs/common';
import { DbService } from '@lib/db';
import { LoggerService } from '@lib/logger';
import { AiService } from './ai/ai.service';

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
  ) { }

  async searchCompanies(params: SearchCompaniesParams): Promise<SearchCompaniesResponse> {

    this.loggerService.info("params", 'input', { params })
    let aiResult = null
    if (params.query)
      aiResult = await this.aiService.enhanceSearch(params.query);

    this.loggerService.info('AI Result', 'AppCompanyService', {
      aiResult,
    });

    const canApplyAi =
      aiResult !== null &&
      aiResult.confidence >= AppCompanyService.AI_CONFIDENCE_THRESHOLD;

    const mergedFilters = {
      sector: params.sector ?? (canApplyAi ? aiResult?.filters.sector : undefined),
      subSector: params.subSector ?? (canApplyAi ? aiResult?.filters.subSector : undefined),
      location: params.location ?? (canApplyAi ? aiResult?.filters.location : undefined),
      tags: canApplyAi ? aiResult?.filters.tags ?? [] : [],
    };

    const similarTerms = canApplyAi ? aiResult?.similarTerms : [];
    this.loggerService.info("mergedFilters", "mergedFilters", { mergedFilters })
    const result = await this.dbService.search(
      mergedFilters,
      { page: params.page, limit: params.limit },
      params.query,
      similarTerms,
    );

    return {
      ...result,
      aiSuggestions: canApplyAi ? aiResult?.suggestions : [],
    };
  }

  async getCompanyById(id: string) {
    return this.dbService.findById(id);
  }
}