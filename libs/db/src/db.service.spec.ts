import { Repository } from 'typeorm';
import { DbService } from './db.service';
import { Company } from './entities/company.entity';

describe('DbService', () => {
  let service: DbService;

  const queryBuilderMock = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const repositoryMock = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
    findOne: jest.fn(),
  };

  beforeEach(() => {
    service = new DbService(repositoryMock as unknown as Repository<Company>);
    jest.clearAllMocks();
  });

  it('searches companies and returns paginated payload', async () => {
    queryBuilderMock.getManyAndCount.mockResolvedValue([[{ id: 'c-101', name: 'Acme' }], 1]);

    const result = await service.search(
      { sector: 'Fintech', location: 'London', tags: ['payments'] },
      'payments',
      ['payment gateway'],
      { page: 1, limit: 20 },
    );

    expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('company');
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('gets company by id', async () => {
    repositoryMock.findOne.mockResolvedValue({ id: 'c-101', name: 'OpenScale' });

    const result = await service.findById('c-101');

    expect(result?.id).toBe('c-101');
  });
});
