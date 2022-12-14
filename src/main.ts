import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const logger = new Logger('main');
  logger.log(`starting api service on port : ${port}`);

  // bootstrap helmet
  app.use(helmet());

  // add validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // bootstrap swagger module
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('CSC API Service')
    .setDescription('CSC API Service Swagger Specification')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('series')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
}
bootstrap();
