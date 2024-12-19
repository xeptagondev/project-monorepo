import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { TrimPipe } from '@app/shared/validations/trim-pipe.transform';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.enableCors();
  app.useGlobalPipes(new TrimPipe());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
