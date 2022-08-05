import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const logger = new Logger('main');
  logger.log(`starting api service on port : ${port}`);

  // add validation Pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
