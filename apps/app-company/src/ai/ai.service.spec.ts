import { LoggerService } from '@lib/logger';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;

  const loggerMock = {
    info: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(() => {
    service = new AiService(loggerMock as unknown as LoggerService);
    jest.clearAllMocks();
  });

  it('returns validated AI response', async () => {
    const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        filters: { sector: 'Fintech', location: 'London', tags: ['payments'] },
        similarTerms: ['digital payments'],
        suggestions: ['Top fintech payment companies in UK'],
        confidence: 0.91,
      }),
    } as any);

    const result = await service.enhanceSearch('fintech payments');

    expect(result?.filters.sector).toBe('Fintech');
    expect(result?.confidence).toBe(0.91);
    fetchMock.mockRestore();
  });

  it('returns null for invalid AI payload', async () => {
    const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        filters: 'invalid',
        similarTerms: ['x'],
        suggestions: ['y'],
        confidence: 2,
      }),
    } as any);

    const result = await service.enhanceSearch('fintech payments');

    expect(result).toBeNull();
    fetchMock.mockRestore();
  });

  it('retries once then returns null on failure', async () => {
    const fetchMock = jest
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('network failure'));

    const result = await service.enhanceSearch('fintech payments');

    expect(result).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    fetchMock.mockRestore();
  });
});
