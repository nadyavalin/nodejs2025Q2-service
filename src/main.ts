import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      disableErrorMessages: false,
    }),
  );

  const openApiDocument = yaml.load(
    fs.readFileSync('./doc/api.yaml', 'utf8'),
  ) as any;

  SwaggerModule.setup('doc', app, openApiDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger UI is available at http://localhost:${port}/doc`);
}
bootstrap();
