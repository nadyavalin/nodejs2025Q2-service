import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { ArtistModule } from './artists/artist.module';
import { TrackModule } from './tracks/track.module';
import { AlbumModule } from './albums/album.module';
import { FavoritesModule } from './favorites/favorites.module';
import { User } from './users/user.entity';
import { Artist } from './artists/artist.entity';
import { Album } from './albums/album.entity';
import { Track } from './tracks/track.entity';
import { Favorites } from './favorites/favorites.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, Artist, Album, Track, Favorites],
        migrations: ['dist/migration/*.js'],
        migrationsRun: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavoritesModule,
  ],
})
export class AppModule {}
