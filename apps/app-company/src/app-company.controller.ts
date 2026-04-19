import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppCompanyService } from './app-company.service';
import { CompanySearchQueryDto } from './dto/company-search.dto';

@Controller('companies')
export class AppCompanyController {
  constructor(private readonly appCompanyService: AppCompanyService) { }

  @Get('search')
  async search(@Query() query: CompanySearchQueryDto) {
    return this.appCompanyService.searchCompanies({
      query: query.query,
      sector: query.sector,
      subSector: query.subSector,
      location: query.location,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  }

  @Get('export')
  async exportCsv(
    @Query() query: CompanySearchQueryDto,
    @Res() res: Response,
  ) {
    const { data } = await this.appCompanyService.searchCompanies({
      query: query.query,
      sector: query.sector,
      subSector: query.subSector,
      location: query.location,
      page: 1,
      limit: 10000, // 🔥 large export
    });

    const csv = this.convertToCSV(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="companies-${Date.now()}.csv"`,
    );

    return res.send(csv);
  }

  /**
   * ✅ Convert JSON → CSV
   */
  private convertToCSV(data: any[]): string {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);

    const escape = (value: any) => {
      if (value === null || value === undefined) return '';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = data.map((row) =>
      headers.map((field) => escape(row[field])).join(','),
    );

    return [headers.join(','), ...rows].join('\n');
  }
}
