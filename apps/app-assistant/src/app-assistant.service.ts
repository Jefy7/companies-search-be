import { Injectable } from '@nestjs/common';

@Injectable()
export class AppAssistantService {
  getHello(): string {
    return 'Hello World!';
  }
}
