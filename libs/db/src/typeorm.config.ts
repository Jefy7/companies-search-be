import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);

  return Number.isNaN(parsed) ? fallback : parsed;
};

export const createTypeOrmOptions = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseNumber(process.env.DB_PORT, 5432),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'companies_search',
    autoLoadEntities: true,
    synchronize: false,
  };
};

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => createTypeOrmOptions(),
};
