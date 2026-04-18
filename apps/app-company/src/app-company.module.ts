import { Module } from '@nestjs/common';
import { AppCompanyController } from './app-company.controller';
import { AppCompanyService } from './app-company.service';

@Module({
  imports: [],
  controllers: [AppCompanyController],
  providers: [AppCompanyService],
})
export class AppCompanyModule {}
