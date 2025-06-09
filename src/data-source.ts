import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService({
  envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: +configService.get('DATABASE_PORT', 5432),
  username: configService.get('DATABASE_USER', 'library_user'),
  password: configService.get('DATABASE_PASSWORD', 'library_password'),
  database: configService.get('DATABASE_NAME', 'home_library'),
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  synchronize: false,
});