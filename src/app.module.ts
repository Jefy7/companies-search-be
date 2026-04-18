import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisService } from './cache/redis.service';
import { typeOrmConfig } from './database/typeorm.config';
import { Company } from './database/entities/company.entity';
import { HttpAiClient } from './modules/ai/ai.client';
import { AiService } from './modules/ai/ai.service';
import { CompanyController } from './modules/company/company.controller';
import { CompanyRepository } from './modules/company/company.repository';
import { CompanyService } from './modules/company/company.service';
import { SearchController } from './modules/search/search.controller';
import { SearchService } from './modules/search/search.service';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig()), TypeOrmModule.forFeature([Company])],
  controllers: [CompanyController, SearchController],
  providers: [
    CompanyService,
    CompanyRepository,
    SearchService,
    RedisService,
    AiService,
    HttpAiClient,
    {
      provide: 'AiClient',
      useExisting: HttpAiClient,
    },
  ],
})
export class AppModule {}
