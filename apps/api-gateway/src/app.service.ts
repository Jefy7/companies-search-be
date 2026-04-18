import { Injectable } from '@nestjs/common';
// import { AppAssistantService } from '../../app-assistant/src/app-assistant.service';
import { AppCompanyService } from '../../app-company/src/app-company.service';

@Injectable()
export class AppService {
  constructor(
    // private readonly assistantService: AppAssistantService,
    private readonly companyService: AppCompanyService,
  ) { }

}
