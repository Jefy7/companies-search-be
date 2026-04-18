import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppCompanyModule } from './app-company.module';

async function bootstrap() {
  const app = await NestFactory.create(AppCompanyModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
