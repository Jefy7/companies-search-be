import { Injectable } from '@nestjs/common';

import { SearchCompanyDto } from '../company/dto/search-company.dto';
import { AiClient } from './ai.service';

@Injectable()
export class HttpAiClient implements AiClient {
  public async parseQuery(query: string): Promise<SearchCompanyDto> {
    const baseUrl = process.env.AI_API_URL;
    if (!baseUrl) {
      return { query };
    }

    const response = await fetch(`${baseUrl}/parse`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('AI service unavailable');
    }

    const payload = (await response.json()) as SearchCompanyDto;
    return payload;
  }
}
