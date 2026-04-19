import { Module } from '@nestjs/common';
import { AppCompanyModule } from '../../app-company/src/app-company.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AppCompanyModule, ConfigModule.forRoot()],
})
export class AppModule { }
