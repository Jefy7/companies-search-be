import { Injectable } from '@nestjs/common';

@Injectable()
export class AppCompanyService {
  getHello(): string {
    return 'Hello World!';
  }
}
