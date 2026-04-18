import { Injectable } from '@nestjs/common';
import { CacheService } from '@lib/cache';
import {
  CompanyRecord,
  CompanySearchFilters,
  CompanySearchParams,
  DbService,
} from '@lib/db';
import { LoggerService } from '@lib/logger';

export interface CompanySearchRequest extends CompanySearchParams {}

export interface CompanySearchResponse {
  total: number;
  items: CompanyRecord[];
  cached: boolean;
}

@Injectable()
export class AppCompanyService {
  constructor(
    private readonly dbService: DbService,
    private readonly cacheService: CacheService,
    private readonly loggerService: LoggerService,
  ) {}

  searchCompanies(request: CompanySearchRequest): CompanySearchResponse {
    const safeQuery = request.query.trim();
    if (!safeQuery) {
      return { total: 0, items: [], cached: false };
    }

    const cacheKey = this.buildCacheKey(safeQuery, request.filters, request.limit);
    const cached = this.cacheService.get<CompanyRecord[]>(cacheKey);

    if (cached) {
      this.loggerService.info('Company search cache hit', 'AppCompanyService', {
        query: safeQuery,
      });
      return {
        total: cached.length,
        items: cached,
        cached: true,
      };
    }

    const items = this.dbService.searchCompanies({
      query: safeQuery,
      filters: request.filters,
      limit: request.limit,
    });

    this.cacheService.set(cacheKey, items, 120_000);
    this.loggerService.info('Company search executed', 'AppCompanyService', {
      query: safeQuery,
      total: items.length,
    });

    return {
      total: items.length,
      items,
      cached: false,
    };
  }

  getCompanyById(id: string): CompanyRecord | null {
    const company = this.dbService.findById(id);
    return company ?? null;
  }

  private buildCacheKey(
    query: string,
    filters?: CompanySearchFilters,
    limit?: number,
  ): string {
    return JSON.stringify({ query, filters: filters ?? {}, limit: limit ?? 10 });
  }
}
