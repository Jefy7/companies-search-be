import { Injectable } from '@nestjs/common';

import { RedisService } from '../../libs/redis/redis.service';
import { hashValue } from '../../libs/utils/hash.util';
import { CompanyRepository, PaginatedCompanies } from '../company/company.repository';
import { SearchCompanyDto } from '../company/dto/search-company.dto';

@Injectable()
export class SearchService {
  private static readonly SEARCH_TTL_SECONDS = 300;

  public constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly redisService: RedisService,
  ) {}

  public async search(filters: SearchCompanyDto): Promise<PaginatedCompanies> {
    const key = `search:${hashValue(filters)}`;
    const cached = await this.redisService.get<PaginatedCompanies>(key);
    if (cached) {
      return cached;
    }

    const results = await this.companyRepository.search(filters);
    await this.redisService.set(key, results, SearchService.SEARCH_TTL_SECONDS);
    return results;
  }
}
