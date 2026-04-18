import { Injectable } from '@nestjs/common';
import { CommonService } from '@lib/common';
import {
  AppCompanyService,
  CompanySearchRequest,
  CompanySearchResponse,
} from '../../app-company/src/app-company.service';

export interface AssistantSearchInput {
  prompt: string;
}

export interface AssistantSearchResponse {
  interpretedQuery: CompanySearchRequest;
  result: CompanySearchResponse;
  explanation: string;
}

@Injectable()
export class AppAssistantService {
  constructor(
    private readonly companyService: AppCompanyService,
    private readonly commonService: CommonService,
  ) {}

  assistCompanySearch(input: AssistantSearchInput): AssistantSearchResponse {
    const interpretedQuery = this.interpretPrompt(input.prompt);
    const result = this.companyService.searchCompanies(interpretedQuery);

    return {
      interpretedQuery,
      result,
      explanation: `Found ${result.total} companies for "${interpretedQuery.query}".`,
    };
  }

  interpretPrompt(prompt: string): CompanySearchRequest {
    const normalized = this.commonService.normalizeText(prompt);
    const filters: CompanySearchRequest['filters'] = {};

    if (normalized.includes('united states') || normalized.includes('usa')) {
      filters.country = 'United States';
    }

    const industries = ['artificial intelligence', 'cybersecurity', 'healthtech', 'logistics', 'e-commerce'];
    const industry = industries.find((item) => normalized.includes(item));
    if (industry) {
      filters.industry = industry === 'e-commerce' ? 'E-Commerce' : this.titleCase(industry);
    }

    const minEmployeesMatch = normalized.match(/(?:over|more than|at least)\s+(\d{2,6})/);
    if (minEmployeesMatch) {
      filters.minEmployees = Number(minEmployeesMatch[1]);
    }

    const tokens = this.commonService.tokenize(normalized);
    const stopWords = new Set([
      'find',
      'companies',
      'company',
      'in',
      'with',
      'for',
      'that',
      'and',
      'the',
      'show',
      'me',
      'over',
      'more',
      'than',
      'at',
      'least',
      'usa',
      'united',
      'states',
    ]);
    const query = tokens.filter((token) => !stopWords.has(token)).slice(0, 4).join(' ');

    return {
      query: query || normalized,
      filters,
      limit: 5,
    };
  }

  private titleCase(value: string): string {
    return value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
