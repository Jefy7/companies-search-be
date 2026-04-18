import { CompanyService } from '../src/apps/company/company.service';

describe('CompanyService', () => {
  it('delegates search', async () => {
    const result = { data: [], total: 0, page: 1, limit: 20 };
    const searchService = { search: jest.fn().mockResolvedValue(result) };
    const service = new CompanyService(searchService as never);

    await expect(service.search({ sector: 'Tech' })).resolves.toEqual(result);
    expect(searchService.search).toHaveBeenCalledWith({ sector: 'Tech' });
  });
});
