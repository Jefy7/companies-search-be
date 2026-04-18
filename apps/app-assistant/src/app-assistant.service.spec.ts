import { CommonService } from '@lib/common';
import { AppCompanyService } from '../../app-company/src/app-company.service';
import { AppAssistantService } from './app-assistant.service';

describe('AppAssistantService', () => {
  let service: AppAssistantService;

  const companyMock = {
    searchCompanies: jest.fn(),
  };

  beforeEach(() => {
    service = new AppAssistantService(
      companyMock as unknown as AppCompanyService,
      new CommonService(),
    );
    jest.clearAllMocks();
  });

  it('should interpret prompt and perform search', () => {
    companyMock.searchCompanies.mockReturnValue({ total: 1, items: [], cached: false });

    const response = service.assistCompanySearch({
      prompt: 'Find artificial intelligence companies in USA over 100 employees',
    });

    expect(response.interpretedQuery.filters?.country).toBe('United States');
    expect(response.interpretedQuery.filters?.industry).toBe('Artificial Intelligence');
    expect(response.interpretedQuery.filters?.minEmployees).toBe(100);
    expect(companyMock.searchCompanies).toHaveBeenCalled();
  });

  it('should extract minimal search query from prompt', () => {
    const interpreted = service.interpretPrompt('show me cybersecurity companies');
    expect(interpreted.query).toContain('cybersecurity');
    expect(interpreted.limit).toBe(5);
  });
});
