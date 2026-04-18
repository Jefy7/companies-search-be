import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppAssistantModule } from './../src/app-assistant.module';

describe('AppAssistantController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppAssistantModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/assistant/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/assistant/health')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
