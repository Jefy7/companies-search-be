import { HttpException } from '@nestjs/common';

import { AiService } from '../src/apps/ai/ai.service';

describe('AiService', () => {
  it('returns cached parsed filters', async () => {
    const cached = { sector: 'Fintech' };
    const redis = { get: jest.fn().mockResolvedValue(cached), set: jest.fn() };
    const aiClient = { parseQuery: jest.fn() };
    const service = new AiService(redis as never, aiClient as never);

    await expect(service.parseQuery('hello')).resolves.toEqual(cached);
    expect(aiClient.parseQuery).not.toHaveBeenCalled();
  });

  it('parses, validates and caches', async () => {
    const parsed = { sector: 'Fintech', limit: 10 };
    const redis = { get: jest.fn().mockResolvedValue(null), set: jest.fn().mockResolvedValue(undefined) };
    const aiClient = { parseQuery: jest.fn().mockResolvedValue(parsed) };
    const service = new AiService(redis as never, aiClient as never);

    await expect(service.parseQuery('query')).resolves.toEqual(parsed);
    expect(redis.set).toHaveBeenCalledTimes(1);
  });

  it('rejects invalid key', () => {
    const service = new AiService({ get: jest.fn(), set: jest.fn() } as never, { parseQuery: jest.fn() } as never);

    expect(() => service.validateAiFilters({ foo: 'bar' } as never)).toThrow(HttpException);
  });

  it('rejects invalid limit', () => {
    const service = new AiService({ get: jest.fn(), set: jest.fn() } as never, { parseQuery: jest.fn() } as never);

    expect(() => service.validateAiFilters({ limit: 101 })).toThrow('Invalid AI limit');
  });
});
