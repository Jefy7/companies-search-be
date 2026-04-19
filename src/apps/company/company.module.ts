import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssistantModule } from '../assistant/assistant.module';
import { Company } from '../../libs/db/entities/company.entity';
import { RedisService } from '../../libs/redis/redis.service';
import { SearchService } from '../search/search.service';
import { CompanyController } from './company.controller';
import { CompanyRepository } from './company.repository';
import { CompanyService } from './company.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), AssistantModule],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, SearchService, RedisService],
  exports: [CompanyService, CompanyRepository, SearchService],
})
export class CompanyModule {}
