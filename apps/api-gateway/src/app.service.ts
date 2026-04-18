import { Injectable } from '@nestjs/common';
import { AppAssistantService } from '../../app-assistant/src/app-assistant.service';
import { AppCompanyService } from '../../app-company/src/app-company.service';

@Injectable()
export class AppService {
  constructor(
    private readonly assistantService: AppAssistantService,
    private readonly companyService: AppCompanyService,
  ) {}

  getServiceInfo() {
    return {
      name: 'ai-company-search-gateway',
      features: ['company-search', 'assistant-search'],
    };
  }

  quickSearch(prompt: string) {
    return this.assistantService.assistCompanySearch({ prompt });
  }

  trendingCompanies() {
    return this.companyService.searchCompanies({
      query: 'ai security health logistics',
      limit: 3,
    });
  }
}
