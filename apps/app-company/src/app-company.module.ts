import { Module } from '@nestjs/common';
import { DbModule } from '@lib/db';
import { LoggerModule } from '@lib/logger';
import { AppCompanyController } from './app-company.controller';
import { AppCompanyService } from './app-company.service';
import { AiService } from './ai/ai.service';

@Module({
  imports: [DbModule, LoggerModule],
  controllers: [AppCompanyController],
  providers: [AppCompanyService, AiService],
  exports: [AppCompanyService],
})
export class AppCompanyModule {}
