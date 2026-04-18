import { NestFactory } from '@nestjs/core';
import { AppAssistantModule } from './app-assistant.module';

async function bootstrap() {
  const app = await NestFactory.create(AppAssistantModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
