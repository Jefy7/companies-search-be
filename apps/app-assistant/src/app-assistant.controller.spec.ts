import { Test, TestingModule } from '@nestjs/testing';
import { AppAssistantController } from './app-assistant.controller';
import { AppAssistantService } from './app-assistant.service';

describe('AppAssistantController', () => {
  let appAssistantController: AppAssistantController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppAssistantController],
      providers: [AppAssistantService],
    }).compile();

    appAssistantController = app.get<AppAssistantController>(AppAssistantController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appAssistantController.getHello()).toBe('Hello World!');
    });
  });
});
