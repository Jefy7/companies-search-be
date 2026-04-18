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

  it('should call search endpoint with mapped query params', async () => {
    serviceMock.searchCompanies.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      aiSuggestions: [],
    });

    await controller.search({
      query: 'ai',
      sector: 'Fintech',
      location: 'United Kingdom',
      page: 2,
      limit: 5,
    });

    expect(serviceMock.searchCompanies).toHaveBeenCalledWith({
      query: 'ai',
      sector: 'Fintech',
      location: 'United Kingdom',
      page: 2,
      limit: 5,
    });
  });

  it('should proxy company lookup by id', async () => {
    serviceMock.getCompanyById.mockResolvedValue({ id: 'c-101' });

    await expect(controller.getById('c-101')).resolves.toEqual({ id: 'c-101' });
  });
});
