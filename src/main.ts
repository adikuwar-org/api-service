import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const logger = new Logger('main');
  logger.log(`starting api service on port : ${port}`);

  // add validation Pipe
  app.useGlobalPipes(new ValidationPipe());

  // bootstrap swagger module
  const config = new DocumentBuilder()
    .setTitle('CSC API Service')
    .setDescription('CSC API Service Swagger Specification')
    .setVersion('1.0')
    .addTag('csc-api')
    .addTag('series')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
}
bootstrap();
