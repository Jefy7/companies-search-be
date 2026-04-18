import { Controller, Get } from '@nestjs/common';
import { AppCompanyService } from './app-company.service';

@Controller()
export class AppCompanyController {
  constructor(private readonly appCompanyService: AppCompanyService) {}

  @Get()
  getHello(): string {
    return this.appCompanyService.getHello();
  }
}
