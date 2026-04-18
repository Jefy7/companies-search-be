import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    service = new CacheService();
  });

  it('sets and gets cache values', () => {
    service.set('a', { value: 1 }, 1000);
    expect(service.get<{ value: number }>('a')).toEqual({ value: 1 });
  });

  it('returns null for expired values', async () => {
    service.set('b', 2, 1);
    await new Promise((resolve) => setTimeout(resolve, 5));

    expect(service.get<number>('b')).toBeNull();
  });

  it('wraps producer function', () => {
    const producer = jest.fn(() => 42);

    expect(service.wrap('answer', producer)).toBe(42);
    expect(service.wrap('answer', producer)).toBe(42);
    expect(producer).toHaveBeenCalledTimes(1);
  });
});
