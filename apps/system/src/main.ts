import { NestFactory } from '@nestjs/core';
import { SystemModule } from './system.module';
import { TrimPipe } from '@app/shared/validations/trim-pipe.transform';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(SystemModule);
  app.enableCors();
  app.useGlobalPipes(new TrimPipe());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
