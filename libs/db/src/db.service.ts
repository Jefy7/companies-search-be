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
  subSector?: string;
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
  ) { }

  async findById(id: string): Promise<CompanyRecord | null> {
    const company = await this.companyRepository.findOne({ where: { id } });
    return company ? this.mapCompany(company) : null;
  }

  async search(
    filters: CompanySearchFilters,
    pagination: PaginationParams,
    query?: string,
    similarTerms?: string[],
  ): Promise<CompanySearchResult> {
    const qb = this.companyRepository.createQueryBuilder('company');
    console.log("filters ==> ", filters)
    // ✅ FIX 1: Use LIKE properly with %
    if (filters.sector) {
      qb.andWhere('company.sector ILIKE :sector', {
        sector: `%${filters.sector}%`,
      });
    }

    if (filters.location) {
      qb.andWhere('company.location ILIKE :location', {
        location: `%${filters.location}%`,
      });
    }

    if (filters.subSector) {
      qb.andWhere('company.sub_sector ILIKE :subSector', {
        subSector: filters.subSector,
      });
    }

    // ✅ FIX 2: Tags search improved
    if (filters.tags && filters.tags.length > 0) {
      qb.andWhere(
        new Brackets((tagsQb) => {
          filters.tags!.forEach((tag, index) => {
            tagsQb.orWhere(`company.tags::text ILIKE :tag_${index}`, {
              [`tag_${index}`]: `%${tag}%`,
            });
          });
        }),
      );
    }

    const keywords = [
      query?.trim(),
      ...(similarTerms ?? []).map((t) => t.trim()),
    ].filter((k): k is string => Boolean(k && k.length > 0));

    // ✅ FIX 3: Strong text search across ALL columns
    if (keywords.length > 0) {
      qb.andWhere(
        new Brackets((textQb) => {
          keywords.forEach((term, index) => {
            textQb.orWhere(
              `
              (
                company.name ILIKE :kw${index}
                OR company.sector ILIKE :kw${index}
                OR company.subSector ILIKE :kw${index}
                OR company.location ILIKE :kw${index}
                OR company.tags::text ILIKE :kw${index}
              )
              `,
              { [`kw${index}`]: `%${term}%` },
            );
          });
        }),
      );

      // ✅ FIX 4: Add FULL-TEXT SEARCH (Postgres powerful search)
      qb.addSelect(
        `
        ts_rank(
          to_tsvector('english',
            company.name || ' ' ||
            company.sector || ' ' ||
            COALESCE(company.subSector, '') || ' ' ||
            company.location || ' ' ||
            COALESCE(company.tags::text, '')
          ),
          plainto_tsquery('english', :ftsQuery)
        )
      `,
        'rank',
      ).setParameter('ftsQuery', keywords.join(' '));

      qb.orderBy('rank', 'DESC');
    } else {
      qb.orderBy('company.name', 'ASC');
    }

    qb.skip((pagination.page - 1) * pagination.limit).take(pagination.limit);

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
