import { Test, TestingModule } from '@nestjs/testing';
import { AppCompanyController } from './app-company.controller';
import { AppCompanyService } from './app-company.service';

describe('AppCompanyController', () => {
  let controller: AppCompanyController;

  const serviceMock = {
    searchCompanies: jest.fn(),
    getCompanyById: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppCompanyController],
      providers: [
        {
          provide: AppCompanyService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = app.get<AppCompanyController>(AppCompanyController);
    jest.clearAllMocks();
  });

  it('should call search endpoint with mapped query params', () => {
    serviceMock.searchCompanies.mockReturnValue({ total: 0, items: [], cached: false });

    controller.search({
      q: 'ai',
      country: 'United States',
      minEmployees: '100',
      limit: '5',
    });

    expect(serviceMock.searchCompanies).toHaveBeenCalledWith({
      query: 'ai',
      limit: 5,
      filters: {
        industry: undefined,
        country: 'United States',
        minEmployees: 100,
        maxEmployees: undefined,
      },
    });
  });

  it('should proxy company lookup by id', () => {
    serviceMock.getCompanyById.mockReturnValue({ id: 'c-101' });

    expect(controller.getById('c-101')).toEqual({ id: 'c-101' });
  });
});
