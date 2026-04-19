import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { RedisService } from '../../libs/redis/redis.service';
import { hashValue } from '../../libs/utils/hash.util';
import { SearchCompanyDto } from '../company/dto/search-company.dto';

export interface AiClient {
  parseQuery(query: string): Promise<SearchCompanyDto>;
}

@Injectable()
export class AiService {
  private static readonly AI_TTL_SECONDS = 300;

  public constructor(
    private readonly redisService: RedisService,
    @Inject('AiClient') private readonly aiClient: AiClient,
  ) {}

  public async parseQuery(query: string): Promise<SearchCompanyDto> {
    const key = `ai:${hashValue(query)}`;
    const cached = await this.redisService.get<SearchCompanyDto>(key);
    if (cached) {
      return cached;
    }

    const parsed = await this.aiClient.parseQuery(query);
    this.validateAiFilters(parsed);
    await this.redisService.set(key, parsed, AiService.AI_TTL_SECONDS);
    return parsed;
  }

  public validateAiFilters(filters: SearchCompanyDto): void {
    const allowedKeys: Array<keyof SearchCompanyDto> = ['sector', 'subSector', 'location', 'tags', 'page', 'limit', 'query'];
    for (const key of Object.keys(filters)) {
      if (!allowedKeys.includes(key as keyof SearchCompanyDto)) {
        throw new HttpException(`Invalid AI filter key: ${key}`, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }

    if (filters.limit !== undefined && (filters.limit < 1 || filters.limit > 100)) {
      throw new HttpException('Invalid AI limit', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
