import { CommonService } from './common.service';

describe('CommonService', () => {
  const service = new CommonService();

  it('normalizes text', () => {
    expect(service.normalizeText('  HeLLo ')).toBe('hello');
  });

  it('scores matching text', () => {
    expect(service.scoreTextMatch('ai platform', 'AI platform for analytics')).toBeGreaterThan(0);
  });

  it('returns unique list by selector', () => {
    expect(
      service.uniqueBy(
        [
          { id: '1', value: 'a' },
          { id: '1', value: 'b' },
          { id: '2', value: 'c' },
        ],
        (item) => item.id,
      ),
    ).toHaveLength(2);
  });
});
