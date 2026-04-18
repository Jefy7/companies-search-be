import { CompanyRepository } from '../src/apps/company/company.repository';

const createQb = () => {
  const qb: Record<string, jest.Mock> = {
    andWhere: jest.fn(),
    addSelect: jest.fn(),
    orderBy: jest.fn(),
    addOrderBy: jest.fn(),
    skip: jest.fn(),
    take: jest.fn(),
    getManyAndCount: jest.fn(),
    select: jest.fn(),
    stream: jest.fn(),
  };
  qb.andWhere.mockReturnValue(qb);
  qb.addSelect.mockReturnValue(qb);
  qb.orderBy.mockReturnValue(qb);
  qb.addOrderBy.mockReturnValue(qb);
  qb.skip.mockReturnValue(qb);
  qb.take.mockReturnValue(qb);
  qb.select.mockReturnValue(qb);
  return qb;
};

describe('CompanyRepository', () => {
  it('builds full query with optional filters', () => {
    const qb = createQb();
    const repo = { createQueryBuilder: jest.fn().mockReturnValue(qb) };
    const repository = new CompanyRepository(repo as never);

    repository.buildSearchQuery({ sector: 'A', subSector: 'B', location: 'C', tags: ['x'], query: 'q' });

    expect(qb.andWhere).toHaveBeenCalledTimes(5);
    expect(qb.addSelect).toHaveBeenCalledTimes(1);
    expect(qb.orderBy).toHaveBeenCalledWith('similarity_rank', 'DESC');
    expect(qb.addOrderBy).toHaveBeenCalledWith('company.createdAt', 'DESC');
  });

  it('searches with default pagination', async () => {
    const qb = createQb();
    qb.getManyAndCount.mockResolvedValue([[{ id: '1' }], 1]);
    const repo = { createQueryBuilder: jest.fn().mockReturnValue(qb) };
    const repository = new CompanyRepository(repo as never);

    const result = await repository.search({});

    expect(qb.skip).toHaveBeenCalledWith(0);
    expect(qb.take).toHaveBeenCalledWith(20);
    expect(result.total).toBe(1);
  });

  it('orders by createdAt when no text query is provided', () => {
    const qb = createQb();
    const repo = { createQueryBuilder: jest.fn().mockReturnValue(qb) };
    const repository = new CompanyRepository(repo as never);

    repository.buildSearchQuery({ sector: 'A' });

    expect(qb.orderBy).toHaveBeenCalledWith('company.createdAt', 'DESC');
    expect(qb.addSelect).not.toHaveBeenCalled();
    expect(qb.addOrderBy).not.toHaveBeenCalled();
  });

  it('searches with explicit pagination', async () => {
    const qb = createQb();
    qb.getManyAndCount.mockResolvedValue([[], 0]);
    const repo = { createQueryBuilder: jest.fn().mockReturnValue(qb) };
    const repository = new CompanyRepository(repo as never);

    await repository.search({ page: 3, limit: 5 });

    expect(qb.skip).toHaveBeenCalledWith(10);
    expect(qb.take).toHaveBeenCalledWith(5);
  });

  it('prepares export select', () => {
    const qb = createQb();
    const repo = { createQueryBuilder: jest.fn().mockReturnValue(qb) };
    const repository = new CompanyRepository(repo as never);

    repository.streamForExport({});

    expect(qb.select).toHaveBeenCalled();
  });
});
