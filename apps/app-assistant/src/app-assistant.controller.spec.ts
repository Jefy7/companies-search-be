import { Test, TestingModule } from '@nestjs/testing';
import { AppAssistantController } from './app-assistant.controller';
import { AppAssistantService } from './app-assistant.service';

describe('AppAssistantController', () => {
  let controller: AppAssistantController;

  const serviceMock = {
    assistCompanySearch: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppAssistantController],
      providers: [
        {
          provide: AppAssistantService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = app.get<AppAssistantController>(AppAssistantController);
    jest.clearAllMocks();
  });

  it('should return healthy state', () => {
    expect(controller.health()).toEqual({ status: 'ok' });
  });

  it('should forward body to assistant service', () => {
    serviceMock.assistCompanySearch.mockReturnValue({ explanation: 'Found 1 companies' });

    expect(controller.assistSearch({ prompt: 'find ai companies' })).toEqual({
      explanation: 'Found 1 companies',
    });
    expect(serviceMock.assistCompanySearch).toHaveBeenCalledWith({
      prompt: 'find ai companies',
    });
  });
});
