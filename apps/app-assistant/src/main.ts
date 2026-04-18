import { NestFactory } from '@nestjs/core';
import { AppAssistantModule } from './app-assistant.module';

async function bootstrap() {
  const app = await NestFactory.create(AppAssistantModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
