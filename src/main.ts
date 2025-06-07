import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('The Library API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const yamlDocument = yaml.dump(document);
  fs.writeFileSync('./doc/api.yaml', yamlDocument);
  SwaggerModule.setup('doc', app, document);
  await app.listen(4000);
  console.log('Server is running on port 4000');
  console.log('Swagger UI is available at http://localhost:4000/doc');
}
bootstrap();
