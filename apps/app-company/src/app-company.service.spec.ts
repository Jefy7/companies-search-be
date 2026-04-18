import { DbService } from '@lib/db';
import { LoggerService } from '@lib/logger';
import { AiService } from './ai/ai.service';
import { AppCompanyService } from './app-company.service';

describe('AppCompanyService', () => {
  let service: AppCompanyService;

  const dbMock = {
    search: jest.fn(),
    findById: jest.fn(),
  };

  const aiMock = {
    enhanceSearch: jest.fn(),
  };

  const loggerMock = {
    info: jest.fn(),
  };

  beforeEach(() => {
    service = new AppCompanyService(
      dbMock as unknown as DbService,
      aiMock as unknown as AiService,
      loggerMock as unknown as LoggerService,
    );
    jest.clearAllMocks();
  });

  it('applies AI filters and suggestions when confidence is high', async () => {
    aiMock.enhanceSearch.mockResolvedValue({
      filters: { sector: 'Fintech', location: 'London', tags: ['payments'] },
      similarTerms: ['digital payments'],
      suggestions: ['Top fintech payment companies in UK'],
      confidence: 0.92,
    });

    dbMock.search.mockResolvedValue({
      data: [{ id: '1' }],
      total: 1,
      page: 1,
      limit: 20,
    });

    const result = await service.searchCompanies({
      query: 'fintech in london',
      page: 1,
      limit: 20,
    });

    expect(dbMock.search).toHaveBeenCalledWith(
      { sector: 'Fintech', location: 'London', tags: ['payments'] },
      'fintech in london',
      ['digital payments'],
      { page: 1, limit: 20 },
    );
    expect(result.aiSuggestions).toEqual(['Top fintech payment companies in UK']);
  });

  it('falls back to user filters when AI fails', async () => {
    aiMock.enhanceSearch.mockResolvedValue(null);
    dbMock.search.mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

    await service.searchCompanies({
      query: 'fintech',
      sector: 'Fintech',
      location: 'London',
      page: 1,
      limit: 20,
    });

    expect(dbMock.search).toHaveBeenCalledWith(
      { sector: 'Fintech', location: 'London', tags: [] },
      'fintech',
      [],
      { page: 1, limit: 20 },
    );
  });

  it('returns no results payload correctly', async () => {
    aiMock.enhanceSearch.mockResolvedValue(null);
    dbMock.search.mockResolvedValue({ data: [], total: 0, page: 2, limit: 10 });

    const result = await service.searchCompanies({
      query: 'unknown',
      page: 2,
      limit: 10,
    });

    expect(result).toEqual({
      data: [],
      total: 0,
      page: 2,
      limit: 10,
      aiSuggestions: [],
    });
  });

  it('passes pagination correctly', async () => {
    aiMock.enhanceSearch.mockResolvedValue(null);
    dbMock.search.mockResolvedValue({ data: [], total: 0, page: 3, limit: 5 });

    await service.searchCompanies({ query: 'payments', page: 3, limit: 5 });

    expect(dbMock.search).toHaveBeenCalledWith(
      { sector: undefined, location: undefined, tags: [] },
      'payments',
      [],
      { page: 3, limit: 5 },
    );
  });

  it('finds company by id', async () => {
    dbMock.findById.mockResolvedValue({ id: 'c-101' });

    await expect(service.getCompanyById('c-101')).resolves.toEqual({ id: 'c-101' });
  });
});
