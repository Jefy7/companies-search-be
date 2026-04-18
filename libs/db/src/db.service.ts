import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Company } from './entities/company.entity';

export interface CompanyRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  sector: string;
  subSector: string | null;
  location: string;
  linkedin: string | null;
  tags: string[];
}

export interface CompanySearchFilters {
  sector?: string;
  location?: string;
  tags?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface CompanySearchResult {
  data: CompanyRecord[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class DbService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findById(id: string): Promise<CompanyRecord | null> {
    const company = await this.companyRepository.findOne({ where: { id } });
    return company ? this.mapCompany(company) : null;
  }

  async search(
    filters: CompanySearchFilters,
    query: string,
    similarTerms: string[],
    pagination: PaginationParams,
  ): Promise<CompanySearchResult> {
    const qb = this.companyRepository.createQueryBuilder('company');

    if (filters.sector) {
      qb.andWhere('company.sector ILIKE :sector', { sector: filters.sector });
    }

    if (filters.location) {
      qb.andWhere('company.location ILIKE :location', { location: filters.location });
    }

    if (filters.tags && filters.tags.length > 0) {
      qb.andWhere(
        new Brackets((tagsQb) => {
          filters.tags?.forEach((tag, index) => {
            tagsQb.orWhere(`CAST(company.tags AS text) ILIKE :tag_${index}`, {
              [`tag_${index}`]: `%${tag}%`,
            });
          });
        }),
      );
    }

    const cleanedQuery = query.trim();
    const cleanedTerms = similarTerms
      .map((term) => term.trim())
      .filter((term) => term.length > 0);

    if (cleanedQuery || cleanedTerms.length > 0) {
      qb.andWhere(
        new Brackets((textQb) => {
          if (cleanedQuery) {
            textQb
              .orWhere('company.name ILIKE :queryPattern', {
                queryPattern: `%${cleanedQuery}%`,
              })
              .orWhere('CAST(company.tags AS text) ILIKE :queryPattern', {
                queryPattern: `%${cleanedQuery}%`,
              })
              .orWhere(
                "to_tsvector('simple', company.name || ' ' || COALESCE(CAST(company.tags AS text), '')) @@ plainto_tsquery('simple', :ftsQuery)",
                { ftsQuery: cleanedQuery },
              );
          }

          cleanedTerms.forEach((term, index) => {
            textQb
              .orWhere(`company.name ILIKE :similar_${index}`, {
                [`similar_${index}`]: `%${term}%`,
              })
              .orWhere(`CAST(company.tags AS text) ILIKE :similar_${index}`, {
                [`similar_${index}`]: `%${term}%`,
              });
          });
        }),
      );
    }

    qb.orderBy('company.name', 'ASC')
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit);

    const [companies, total] = await qb.getManyAndCount();

    return {
      data: companies.map((company) => this.mapCompany(company)),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  private mapCompany(company: Company): CompanyRecord {
    return {
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      sector: company.sector,
      subSector: company.subSector ?? null,
      location: company.location,
      linkedin: company.linkedin ?? null,
      tags: company.tags ?? [],
    };
  }
}
