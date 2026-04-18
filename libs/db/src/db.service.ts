import { Injectable } from '@nestjs/common';
import { CommonService } from '@lib/common';

export interface CompanyRecord {
  id: string;
  name: string;
  domain: string;
  industry: string;
  country: string;
  employeeCount: number;
  tags: string[];
  description: string;
}

export interface CompanySearchFilters {
  industry?: string;
  country?: string;
  minEmployees?: number;
  maxEmployees?: number;
}

export interface CompanySearchParams {
  query: string;
  limit?: number;
  filters?: CompanySearchFilters;
}

@Injectable()
export class DbService {
  constructor(private readonly commonService: CommonService) {}

  private readonly companies: CompanyRecord[] = [
    {
      id: 'c-101',
      name: 'OpenScale Analytics',
      domain: 'openscale.ai',
      industry: 'Artificial Intelligence',
      country: 'United States',
      employeeCount: 230,
      tags: ['llm', 'rag', 'analytics'],
      description: 'AI platform focused on retrieval-augmented enterprise analytics.',
    },
    {
      id: 'c-102',
      name: 'BlueCart Commerce',
      domain: 'bluecart.io',
      industry: 'E-Commerce',
      country: 'United States',
      employeeCount: 95,
      tags: ['marketplace', 'retail', 'payments'],
      description: 'B2B commerce operating tools for distributors and retailers.',
    },
    {
      id: 'c-103',
      name: 'Nimbus Cyber Defense',
      domain: 'nimbuscyber.com',
      industry: 'Cybersecurity',
      country: 'Canada',
      employeeCount: 420,
      tags: ['siem', 'security', 'threat-intel'],
      description: 'Cloud-native threat monitoring and incident response automation.',
    },
    {
      id: 'c-104',
      name: 'Helio Health Systems',
      domain: 'heliohealth.io',
      industry: 'HealthTech',
      country: 'United States',
      employeeCount: 160,
      tags: ['ehr', 'telehealth', 'compliance'],
      description: 'Digital patient engagement and clinical workflow platform.',
    },
    {
      id: 'c-105',
      name: 'Vertex Logistics Network',
      domain: 'vertexlogistics.net',
      industry: 'Logistics',
      country: 'Germany',
      employeeCount: 1100,
      tags: ['supply-chain', 'routing', 'fleet'],
      description: 'Cross-border freight optimization and route intelligence.',
    },
  ];

  findById(id: string): CompanyRecord | undefined {
    return this.companies.find((company) => company.id === id);
  }

  searchCompanies(params: CompanySearchParams): CompanyRecord[] {
    const { query, limit = 10, filters } = params;
    const normalizedIndustry = filters?.industry
      ? this.commonService.normalizeText(filters.industry)
      : undefined;
    const normalizedCountry = filters?.country
      ? this.commonService.normalizeText(filters.country)
      : undefined;

    const scored = this.companies
      .filter((company) => {
        if (
          normalizedIndustry &&
          this.commonService.normalizeText(company.industry) !== normalizedIndustry
        ) {
          return false;
        }

        if (
          normalizedCountry &&
          this.commonService.normalizeText(company.country) !== normalizedCountry
        ) {
          return false;
        }

        if (
          typeof filters?.minEmployees === 'number' &&
          company.employeeCount < filters.minEmployees
        ) {
          return false;
        }

        if (
          typeof filters?.maxEmployees === 'number' &&
          company.employeeCount > filters.maxEmployees
        ) {
          return false;
        }

        return true;
      })
      .map((company) => {
        const textCorpus = [
          company.name,
          company.description,
          company.industry,
          company.tags.join(' '),
        ].join(' ');

        return {
          company,
          score: this.commonService.scoreTextMatch(query, textCorpus),
        };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => entry.company);

    return this.commonService.uniqueBy(scored, (item) => item.id);
  }
}
