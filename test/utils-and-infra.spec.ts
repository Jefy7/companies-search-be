import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

import { RedisService } from '../src/cache/redis.service';
import { GlobalExceptionFilter } from '../src/common/exceptions/global-exception.filter';
import { HttpAiClient } from '../src/modules/ai/ai.client';
import { Company as ReExportCompany } from '../src/modules/company/entity/company.entity';
import { createCsvStream } from '../src/utils/csv.util';
import { hashValue } from '../src/utils/hash.util';

describe('Utils and infra', () => {
  it('hashValue is deterministic', () => {
    expect(hashValue({ a: 1 })).toBe(hashValue({ a: 1 }));
    expect(hashValue({ a: 1 })).not.toBe(hashValue({ a: 2 }));
  });

  it('csv stream escapes values', async () => {
    async function* records() {
      yield { name: 'A"B', email: 'a@b.com', phone: '1', sector: 's', subSector: 'ss', location: 'loc', linkedin: 'l' };
    }
    const stream = createCsvStream(records());
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const csv = Buffer.concat(chunks).toString('utf8');
    expect(csv).toContain('"A""B"');
  });

  it('redis service handles missing client', async () => {
    const service = new RedisService();
    await expect(service.get('k')).resolves.toBeNull();
    await expect(service.set('k', { x: 1 }, 1)).resolves.toBeUndefined();
  });

  it('redis service round trip', async () => {
    const store = new Map<string, string>();
    const client = {
      get: jest.fn(async (key: string) => store.get(key) ?? null),
      set: jest.fn(async (key: string, value: string) => {
        store.set(key, value);
        return 'OK';
      }),
    };
    const service = new RedisService(client as never);
    await service.set('k', { z: 1 }, 10);
    await expect(service.get<{ z: number }>('k')).resolves.toEqual({ z: 1 });
  });

  it('global exception filter handles http exception', () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const host = {
      switchToHttp: () => ({ getResponse: () => response, getRequest: () => ({ url: '/x' }) }),
    } as ArgumentsHost;
    const filter = new GlobalExceptionFilter();

    filter.catch(new HttpException('bad', HttpStatus.BAD_REQUEST), host);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  it('global exception filter handles unknown exception', () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const host = {
      switchToHttp: () => ({ getResponse: () => response, getRequest: () => ({ url: '/x' }) }),
    } as ArgumentsHost;
    const filter = new GlobalExceptionFilter();

    filter.catch(new Error('oops'), host);
    expect(response.status).toHaveBeenCalledWith(500);
  });

  it('http ai client falls back when url absent', async () => {
    const old = process.env.AI_API_URL;
    delete process.env.AI_API_URL;
    const client = new HttpAiClient();
    await expect(client.parseQuery('q')).resolves.toEqual({ query: 'q' });
    process.env.AI_API_URL = old;
  });

  it('http ai client calls fetch and handles errors', async () => {
    const oldUrl = process.env.AI_API_URL;
    const oldFetch = global.fetch;
    process.env.AI_API_URL = 'http://ai';
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ sector: 'x' }) }) as never;
    const client = new HttpAiClient();

    await expect(client.parseQuery('q')).resolves.toEqual({ sector: 'x' });

    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as never;
    await expect(client.parseQuery('q')).rejects.toThrow('AI service unavailable');

    process.env.AI_API_URL = oldUrl;
    global.fetch = oldFetch;
  });

  it('exports company entity', () => {
    expect(ReExportCompany).toBeDefined();
  });
});
