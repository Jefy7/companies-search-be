import { Module } from '@nestjs/common';
import { CommonModule } from '@lib/common';
import { AppCompanyModule } from '../../app-company/src/app-company.module';
import { AppAssistantController } from './app-assistant.controller';
import { AppAssistantService } from './app-assistant.service';

@Module({
  imports: [AppCompanyModule, CommonModule],
  controllers: [AppAssistantController],
  providers: [AppAssistantService],
  exports: [AppAssistantService],
})
export class AppAssistantModule {}
