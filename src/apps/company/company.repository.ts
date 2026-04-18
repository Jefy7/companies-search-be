import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectQueryBuilder, Repository } from 'typeorm';

import { Company } from '../../libs/db/entities/company.entity';
import { SearchCompanyDto } from './dto/search-company.dto';

export interface PaginatedCompanies {
  data: Company[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class CompanyRepository {
  public constructor(
    @InjectRepository(Company)
    private readonly repository: Repository<Company>,
  ) {}

  public buildSearchQuery(filters: SearchCompanyDto): SelectQueryBuilder<Company> {
    const query = this.repository.createQueryBuilder('company');

    if (filters.sector) {
      query.andWhere('company.sector = :sector', { sector: filters.sector });
    }
    if (filters.subSector) {
      query.andWhere('company.subSector = :subSector', { subSector: filters.subSector });
    }
    if (filters.location) {
      query.andWhere('company.location = :location', { location: filters.location });
    }
    if (filters.tags?.length) {
      query.andWhere('company.tags @> :tags', { tags: JSON.stringify(filters.tags) });
    }
    if (filters.query) {
      query.andWhere('(company.name ILIKE :query OR company.sector ILIKE :query OR company.subSector ILIKE :query)', {
        query: `%${filters.query}%`,
      });
    }
    return query.orderBy('company.createdAt', 'DESC');
  }

  public async search(filters: SearchCompanyDto): Promise<PaginatedCompanies> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const offset = (page - 1) * limit;

    const query = this.buildSearchQuery(filters).skip(offset).take(limit);
    const [data, total] = await query.getManyAndCount();

    return { data, total, page, limit };
  }

  public streamForExport(filters: SearchCompanyDto): SelectQueryBuilder<Company> {
    return this.buildSearchQuery(filters).select([
      'company.name',
      'company.email',
      'company.phone',
      'company.sector',
      'company.subSector',
      'company.location',
      'company.linkedin',
    ]);
  }
}
