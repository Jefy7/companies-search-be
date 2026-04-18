import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { AiQueryDto } from '../ai/dto/ai-query.dto';
import { Company } from '../../libs/db/entities/company.entity';
import { createCsvStream } from '../../libs/utils/csv.util';
import { CompanyRepository } from './company.repository';
import { CompanyService } from './company.service';
import { SearchCompanyDto } from './dto/search-company.dto';

@Controller('companies')
export class CompanyController {
  public constructor(
    private readonly companyService: CompanyService,
    private readonly companyRepository: CompanyRepository,
  ) {}

  @Get()
  public async search(@Query() query: SearchCompanyDto) {
    return this.companyService.search(query);
  }

  @Post('assistant-search')
  public async assistantSearch(@Body() dto: AiQueryDto) {
    return this.companyService.assistantSearch(dto);
  }

  @Get('export')
  public async exportCsv(@Query() query: SearchCompanyDto, @Res() res: Response): Promise<void> {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="companies.csv"');

    const qb = this.companyRepository.streamForExport(query);
    const iterable = qb.stream() as unknown as AsyncIterable<Partial<Company>>;
    const csvStream = createCsvStream(iterable);
    csvStream.pipe(res);
  }
}
