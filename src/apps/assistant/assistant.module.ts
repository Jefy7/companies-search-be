import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpAiClient } from '../ai/ai.client';
import { AiService } from '../ai/ai.service';
import { Company } from '../../libs/db/entities/company.entity';
import { RedisService } from '../../libs/redis/redis.service';
import { CompanyRepository } from '../company/company.repository';
import { SearchService } from '../search/search.service';
import { AssistantOrchestrator } from './assistant.orchestrator';
import { AssistantService } from './assistant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [
    AssistantService,
    AssistantOrchestrator,
    SearchService,
    CompanyRepository,
    RedisService,
    AiService,
    HttpAiClient,
    {
      provide: 'AiClient',
      useExisting: HttpAiClient,
    },
  ],
  exports: [AssistantService],
})
export class AssistantModule {}
