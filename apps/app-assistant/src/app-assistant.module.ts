import { Module } from '@nestjs/common';
import { AppAssistantController } from './app-assistant.controller';
import { AppAssistantService } from './app-assistant.service';

@Module({
  imports: [],
  controllers: [AppAssistantController],
  providers: [AppAssistantService],
})
export class AppAssistantModule {}
