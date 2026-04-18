import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppCompanyModule } from './../src/app-company.module';

describe('AppCompanyController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppCompanyModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/companies/search (GET)', () => {
    return request(app.getHttpServer())
      .get('/companies/search?q=ai')
      .expect(200)
      .expect((response) => {
        expect(response.body.total).toBeGreaterThan(0);
      });
  });
});
