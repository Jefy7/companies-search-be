import { CommonModule } from '@lib/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db.service';
import { Company } from './entities/company.entity';
import { typeOrmConfig } from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfig),
    TypeOrmModule.forFeature([Company]),
    CommonModule,
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
