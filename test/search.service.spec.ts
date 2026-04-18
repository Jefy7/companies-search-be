import { SearchService } from '../src/modules/search/search.service';
import { SearchCompanyDto } from '../src/modules/company/dto/search-company.dto';

describe('SearchService', () => {
  it('returns cached value when present', async () => {
    const filters: SearchCompanyDto = { sector: 'Fintech' };
    const cached = { data: [], total: 1, page: 1, limit: 20 };
    const redisService = { get: jest.fn().mockResolvedValue(cached), set: jest.fn() };
    const companyRepository = { search: jest.fn() };

    const service = new SearchService(companyRepository as never, redisService as never);
    const result = await service.search(filters);

    expect(result).toEqual(cached);
    expect(companyRepository.search).not.toHaveBeenCalled();
  });

  it('calls repository and caches when miss', async () => {
    const filters: SearchCompanyDto = { location: 'London', page: 2, limit: 10 };
    const repoResult = { data: [], total: 0, page: 2, limit: 10 };
    const redisService = { get: jest.fn().mockResolvedValue(null), set: jest.fn().mockResolvedValue(undefined) };
    const companyRepository = { search: jest.fn().mockResolvedValue(repoResult) };

    const service = new SearchService(companyRepository as never, redisService as never);
    const result = await service.search(filters);

    expect(result).toEqual(repoResult);
    expect(companyRepository.search).toHaveBeenCalledWith(filters);
    expect(redisService.set).toHaveBeenCalledTimes(1);
  });
});
