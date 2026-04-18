import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { GlobalExceptionFilter } from '../src/apps/common/exceptions/global-exception.filter';
import { AiService } from '../src/apps/ai/ai.service';
import { CompanyController } from '../src/apps/company/company.controller';
import { CompanyRepository } from '../src/apps/company/company.repository';
import { CompanyService } from '../src/apps/company/company.service';
import { SearchController } from '../src/apps/search/search.controller';
import { SearchService } from '../src/apps/search/search.service';

describe('Controllers integration', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController, SearchController],
      providers: [
        { provide: CompanyService, useValue: { search: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 }) } },
        { provide: CompanyRepository, useValue: { streamForExport: jest.fn().mockReturnValue({ stream: () => (async function*(){ yield { name:'a' }; })() }) } },
        { provide: SearchService, useValue: { search: jest.fn().mockResolvedValue({ data: [], total: 1, page: 1, limit: 20 }) } },
        { provide: AiService, useValue: { parseQuery: jest.fn().mockResolvedValue({ sector: 'Fintech' }) } },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /companies', async () => {
    await request(app.getHttpServer()).get('/companies?sector=Fintech').expect(200).expect(({ body }) => {
      expect(body.total).toBe(0);
    });
  });

  it('POST /search/ai', async () => {
    await request(app.getHttpServer()).post('/search/ai').send({ query: 'fintech london' }).expect(201).expect(({ body }) => {
      expect(body.total).toBe(1);
    });
  });

  it('POST /search/ai invalid body', async () => {
    await request(app.getHttpServer()).post('/search/ai').send({ query: '' }).expect(400);
  });

  it('GET /companies/export', async () => {
    const response = await request(app.getHttpServer()).get('/companies/export').expect(200);
    expect(response.text).toContain('name,email,phone,sector,subSector,location,linkedin');
  });
});
