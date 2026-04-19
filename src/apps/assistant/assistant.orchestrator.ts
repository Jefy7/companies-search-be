import { Injectable } from '@nestjs/common';

import { AiService } from '../ai/ai.service';
import { AiQueryDto } from '../ai/dto/ai-query.dto';
import { PaginatedCompanies } from '../company/company.repository';
import { SearchService } from '../search/search.service';

export interface AssistantSearchResponse {
  results: PaginatedCompanies;
  summary?: string;
}

@Injectable()
export class AssistantOrchestrator {
  public constructor(
    private readonly aiService: AiService,
    private readonly searchService: SearchService,
  ) {}

  public async handlePrompt(dto: AiQueryDto): Promise<AssistantSearchResponse> {
    const filters = await this.aiService.parseQuery(dto.query);
    this.aiService.validateAiFilters(filters);

    const results = await this.searchService.search(filters);
    const summary = this.buildOptionalSummary(results);

    return { results, ...(summary ? { summary } : {}) };
  }

  private buildOptionalSummary(results: PaginatedCompanies): string | undefined {
    if (!results.total) {
      return 'No companies matched your request.';
    }

    return `Found ${results.total} companies. Returning page ${results.page} with ${results.data.length} companies.`;
  }
}
