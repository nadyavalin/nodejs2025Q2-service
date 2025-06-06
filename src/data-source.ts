import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { Artist } from './artists/artist.entity';
import { Album } from './albums/album.entity';
import { Track } from './tracks/track.entity';
import { Favorites } from './favorites/favorites.entity';

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST') || 'db',
  port: +configService.get('DATABASE_PORT') || 5432,
  username: configService.get('DATABASE_USER') || 'library_user',
  password: configService.get('DATABASE_PASSWORD') || 'library_password',
  database: configService.get('DATABASE_NAME') || 'home_library',
  entities: [User, Artist, Album, Track, Favorites],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
});
