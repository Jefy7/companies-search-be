import { Module } from '@nestjs/common';
import { AppAssistantModule } from '../../app-assistant/src/app-assistant.module';
import { AppCompanyModule } from '../../app-company/src/app-company.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AppAssistantModule, AppCompanyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
