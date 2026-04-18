import { Injectable } from '@nestjs/common';

import { AiQueryDto } from '../ai/dto/ai-query.dto';
import { AssistantService } from '../assistant/assistant.service';
import { SearchService } from '../search/search.service';
import { SearchCompanyDto } from './dto/search-company.dto';

@Injectable()
export class CompanyService {
  public constructor(
    private readonly searchService: SearchService,
    private readonly assistantService: AssistantService,
  ) {}

  public search(filters: SearchCompanyDto) {
    return this.searchService.search(filters);
  }

  public assistantSearch(dto: AiQueryDto) {
    return this.assistantService.searchWithPrompt(dto);
  }
}
