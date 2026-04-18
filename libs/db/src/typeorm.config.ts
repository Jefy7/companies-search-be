import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);

  return Number.isNaN(parsed) ? fallback : parsed;
};

export const createTypeOrmOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbType = configService.get<TypeOrmModuleOptions['type']>('DB_TYPE', 'postgres');

  return {
    type: dbType,
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: parseNumber(configService.get<string>('DB_PORT'), 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_NAME', 'companies_search'),
    autoLoadEntities: true,
    synchronize: configService.get<string>('DB_SYNC', 'false') === 'true',
  };
};

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => createTypeOrmOptions(configService),
};
