import { NestFactory } from '@nestjs/core';
import { AppCompanyModule } from './app-company.module';

async function bootstrap() {
  const app = await NestFactory.create(AppCompanyModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
