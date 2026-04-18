import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  AppAssistantService,
  AssistantSearchInput,
  AssistantSearchResponse,
} from './app-assistant.service';

@Controller('assistant')
export class AppAssistantController {
  constructor(private readonly appAssistantService: AppAssistantService) {}

  @Get('health')
  health(): { status: string } {
    return { status: 'ok' };
  }

  @Post('company-search')
  assistSearch(@Body() body: AssistantSearchInput): AssistantSearchResponse {
    return this.appAssistantService.assistCompanySearch(body);
  }
}
