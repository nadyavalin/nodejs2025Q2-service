import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { User } from './users/user.entity';
import { Artist } from './artists/artist.entity';
import { Album } from './albums/album.entity';
import { Track } from './tracks/track.entity';
import { Favorites } from './favorites/favorites.entity';

dotenv.config();

const configService = new ConfigService();

if (!configService.get('DATABASE_HOST')) {
  throw new Error('DATABASE_HOST is not defined in .env');
}
if (!configService.get('DATABASE_PORT')) {
  throw new Error('DATABASE_PORT is not defined in .env');
}
if (!configService.get('DATABASE_USER')) {
  throw new Error('DATABASE_USER is not defined in .env');
}
if (!configService.get('DATABASE_PASSWORD')) {
  throw new Error('DATABASE_PASSWORD is not defined in .env');
}
if (!configService.get('DATABASE_NAME')) {
  throw new Error('DATABASE_NAME is not defined in .env');
}

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: +configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [User, Artist, Album, Track, Favorites],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
});
