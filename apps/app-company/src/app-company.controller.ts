import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  AppCompanyService,
  CompanySearchRequest,
  CompanySearchResponse,
} from './app-company.service';

@Controller('companies')
export class AppCompanyController {
  constructor(private readonly appCompanyService: AppCompanyService) {}

  @Get('search')
  search(@Query() query: Record<string, string | undefined>): CompanySearchResponse {
    const request = this.buildSearchRequest(query);
    return this.appCompanyService.searchCompanies(request);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.appCompanyService.getCompanyById(id);
  }

  private buildSearchRequest(
    query: Record<string, string | undefined>,
  ): CompanySearchRequest {
    return {
      query: query.q ?? '',
      limit: query.limit ? Number(query.limit) : undefined,
      filters: {
        industry: query.industry,
        country: query.country,
        minEmployees: query.minEmployees ? Number(query.minEmployees) : undefined,
        maxEmployees: query.maxEmployees ? Number(query.maxEmployees) : undefined,
      },
    };
  }
}
