import { Module } from '@nestjs/common';
import { DbModule } from '@lib/db';
import { LoggerModule } from '@lib/logger';
import { AppCompanyController } from './app-company.controller';
import { AppCompanyService } from './app-company.service';
import { AiService } from './ai/ai.service';
import { CacheService } from '@lib/cache';
@Module({
  imports: [DbModule, LoggerModule],
  controllers: [AppCompanyController],
  providers: [AppCompanyService, AiService, CacheService],
  exports: [AppCompanyService],
})
export class AppCompanyModule { }
