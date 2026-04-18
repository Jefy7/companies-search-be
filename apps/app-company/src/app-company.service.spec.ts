import { CacheService } from '@lib/cache';
import { DbService } from '@lib/db';
import { LoggerService } from '@lib/logger';
import { AppCompanyService } from './app-company.service';

describe('AppCompanyService', () => {
  let service: AppCompanyService;
  const dbMock = {
    searchCompanies: jest.fn(),
    findById: jest.fn(),
  };
  const cacheMock = {
    get: jest.fn(),
    set: jest.fn(),
  };
  const loggerMock = {
    info: jest.fn(),
  };

  beforeEach(() => {
    service = new AppCompanyService(
      dbMock as unknown as DbService,
      cacheMock as unknown as CacheService,
      loggerMock as unknown as LoggerService,
    );
    jest.clearAllMocks();
  });

  it('returns cached search results when available', () => {
    cacheMock.get.mockReturnValue([{ id: 'c-101' }]);

    const response = service.searchCompanies({ query: 'ai' });

    expect(response.cached).toBe(true);
    expect(response.total).toBe(1);
    expect(dbMock.searchCompanies).not.toHaveBeenCalled();
  });

  it('searches database and caches results on miss', () => {
    cacheMock.get.mockReturnValue(null);
    dbMock.searchCompanies.mockReturnValue([{ id: 'c-102' }, { id: 'c-103' }]);

    const response = service.searchCompanies({ query: 'security' });

    expect(response.cached).toBe(false);
    expect(response.total).toBe(2);
    expect(cacheMock.set).toHaveBeenCalled();
  });

  it('finds company by id', () => {
    dbMock.findById.mockReturnValue({ id: 'c-101' });

    expect(service.getCompanyById('c-101')).toEqual({ id: 'c-101' });
  });
});
