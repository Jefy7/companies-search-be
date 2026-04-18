import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppCompanyService } from './app-company.service';
import { CompanySearchQueryDto } from './dto/company-search.dto';

@Controller('companies')
export class AppCompanyController {
  constructor(private readonly appCompanyService: AppCompanyService) {}

  @Get('search')
  async search(@Query() query: CompanySearchQueryDto) {
    return this.appCompanyService.searchCompanies({
      query: query.query,
      sector: query.sector,
      location: query.location,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.appCompanyService.getCompanyById(id);
  }
}
