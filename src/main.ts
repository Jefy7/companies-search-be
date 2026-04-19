import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ApiGatewayModule } from './apps/api-gateway/api-gateway.module';
import { GlobalExceptionFilter } from './libs/utils/global-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

void bootstrap();
