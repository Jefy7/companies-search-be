import { Module } from '@nestjs/common';
import { CacheModule } from '@lib/cache';
import { DbModule } from '@lib/db';
import { LoggerModule } from '@lib/logger';
import { AppCompanyController } from './app-company.controller';
import { AppCompanyService } from './app-company.service';

@Module({
  imports: [DbModule, CacheModule, LoggerModule],
  controllers: [AppCompanyController],
  providers: [AppCompanyService],
  exports: [AppCompanyService],
})
export class AppCompanyModule {}
