import { CommonService } from '@lib/common';
import { DbService } from './db.service';

describe('DbService', () => {
  let service: DbService;

  beforeEach(() => {
    service = new DbService(new CommonService());
  });

  it('searches companies by query', () => {
    const results = service.searchCompanies({ query: 'analytics ai' });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toContain('OpenScale');
  });

  it('applies filters', () => {
    const results = service.searchCompanies({
      query: 'cloud security',
      filters: {
        country: 'Canada',
      },
    });

    expect(results.every((item) => item.country === 'Canada')).toBe(true);
  });

  it('gets company by id', () => {
    expect(service.findById('c-101')?.name).toContain('OpenScale');
  });
});
