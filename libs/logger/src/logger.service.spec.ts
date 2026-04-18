import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    service = new LoggerService();
  });

  it('stores log entries with levels', () => {
    service.info('information', 'TestContext', { id: '1' });
    service.warn('warning');

    const entries = service.getEntries();

    expect(entries).toHaveLength(2);
    expect(entries[0].level).toBe('info');
    expect(entries[1].level).toBe('warn');
  });

  it('clears log entries', () => {
    service.error('oops');
    service.clear();

    expect(service.getEntries()).toHaveLength(0);
  });
});
