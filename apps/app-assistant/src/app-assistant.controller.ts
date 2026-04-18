import { Controller, Get } from '@nestjs/common';
import { AppAssistantService } from './app-assistant.service';

@Controller()
export class AppAssistantController {
  constructor(private readonly appAssistantService: AppAssistantService) {}

  @Get()
  getHello(): string {
    return this.appAssistantService.getHello();
  }
}
