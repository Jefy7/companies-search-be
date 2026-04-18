import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return this.appService.getServiceInfo();
  }

  @Get('assistant/quick-search')
  quickSearch(@Query('prompt') prompt = '') {
    return this.appService.quickSearch(prompt);
  }

  @Get('companies/trending')
  getTrending() {
    return this.appService.trendingCompanies();
  }
}
