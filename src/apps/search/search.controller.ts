import { Body, Controller, Post } from '@nestjs/common';

import { AiQueryDto } from '../ai/dto/ai-query.dto';
import { AiService } from '../ai/ai.service';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  public constructor(
    private readonly aiService: AiService,
    private readonly searchService: SearchService,
  ) {}

  @Post('ai')
  public async aiSearch(@Body() dto: AiQueryDto) {
    const filters = await this.aiService.parseQuery(dto.query);
    return this.searchService.search(filters);
  }
}
