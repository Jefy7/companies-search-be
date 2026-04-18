import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisService } from './libs/redis/redis.service';
import { typeOrmConfig } from './libs/db/typeorm.config';
import { Company } from './libs/db/entities/company.entity';
import { HttpAiClient } from './apps/ai/ai.client';
import { AiService } from './apps/ai/ai.service';
import { CompanyController } from './apps/company/company.controller';
import { CompanyRepository } from './apps/company/company.repository';
import { CompanyService } from './apps/company/company.service';
import { SearchController } from './apps/search/search.controller';
import { SearchService } from './apps/search/search.service';

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
