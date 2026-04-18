import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  const serviceMock = {
    getServiceInfo: jest.fn(),
    quickSearch: jest.fn(),
    trendingCompanies: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
    jest.clearAllMocks();
  });

  it('should return service health info', () => {
    serviceMock.getServiceInfo.mockReturnValue({ name: 'gateway' });
    expect(controller.getHealth()).toEqual({ name: 'gateway' });
  });

  it('should execute quick search', () => {
    serviceMock.quickSearch.mockReturnValue({ result: { total: 1 } });

    expect(controller.quickSearch('ai')).toEqual({ result: { total: 1 } });
    expect(serviceMock.quickSearch).toHaveBeenCalledWith('ai');
  });

  it('should return trending companies', () => {
    serviceMock.trendingCompanies.mockReturnValue({ total: 3, items: [] });

    expect(controller.getTrending()).toEqual({ total: 3, items: [] });
  });
});
