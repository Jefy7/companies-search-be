import { CompanyService } from '../src/apps/company/company.service';

describe('CompanyService', () => {
  it('delegates search', async () => {
    const result = { data: [], total: 0, page: 1, limit: 20 };
    const searchService = { search: jest.fn().mockResolvedValue(result) };
    const assistantService = { searchWithPrompt: jest.fn() };
    const service = new CompanyService(searchService as never, assistantService as never);

    await expect(service.search({ sector: 'Tech' })).resolves.toEqual(result);
    expect(searchService.search).toHaveBeenCalledWith({ sector: 'Tech' });
  });

  it('delegates assistant search', async () => {
    const result = { results: { data: [], total: 0, page: 1, limit: 20 }, summary: 'No companies matched your request.' };
    const searchService = { search: jest.fn() };
    const assistantService = { searchWithPrompt: jest.fn().mockResolvedValue(result) };
    const service = new CompanyService(searchService as never, assistantService as never);

    await expect(service.assistantSearch({ query: 'fintech in berlin' })).resolves.toEqual(result);
    expect(assistantService.searchWithPrompt).toHaveBeenCalledWith({ query: 'fintech in berlin' });
  });
});
