import { Test, TestingModule } from '@nestjs/testing';
import { AppCompanyController } from './app-company.controller';
import { AppCompanyService } from './app-company.service';

describe('AppCompanyController', () => {
  let appCompanyController: AppCompanyController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppCompanyController],
      providers: [AppCompanyService],
    }).compile();

    appCompanyController = app.get<AppCompanyController>(AppCompanyController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appCompanyController.getHello()).toBe('Hello World!');
    });
  });
});
