import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyModule } from '../company/company.module';
import { typeOrmConfig } from '../../libs/db/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig()), CompanyModule],
})
export class ApiGatewayModule {}
