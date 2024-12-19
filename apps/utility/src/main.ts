import { NestFactory } from '@nestjs/core';
import { UtilityModule } from './utility.module';
import { TrimPipe } from '@app/shared/validations/trim-pipe.transform';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UtilityModule);
  app.enableCors();
  app.useGlobalPipes(new TrimPipe());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
