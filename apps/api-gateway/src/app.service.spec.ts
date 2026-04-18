import { AppAssistantService } from '../../app-assistant/src/app-assistant.service';
import { AppCompanyService } from '../../app-company/src/app-company.service';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  const assistantMock = {
    assistCompanySearch: jest.fn(),
  };

  const companyMock = {
    searchCompanies: jest.fn(),
  };

  beforeEach(() => {
    service = new AppService(
      assistantMock as unknown as AppAssistantService,
      companyMock as unknown as AppCompanyService,
    );
    jest.clearAllMocks();
  });

  it('returns service info', () => {
    expect(service.getServiceInfo()).toEqual({
      name: 'ai-company-search-gateway',
      features: ['company-search', 'assistant-search'],
    });
  });

  it('delegates quick search to assistant service', () => {
    assistantMock.assistCompanySearch.mockReturnValue({ explanation: 'ok' });
    expect(service.quickSearch('find ai')).toEqual({ explanation: 'ok' });
  });

  it('returns trending companies', () => {
    companyMock.searchCompanies.mockReturnValue({ total: 3, items: [] });
    expect(service.trendingCompanies()).toEqual({ total: 3, items: [] });
  });
});
