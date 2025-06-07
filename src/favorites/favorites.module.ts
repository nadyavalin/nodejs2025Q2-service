import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { FavoritesRepository } from './favorites.repository';
import { ArtistModule } from '../artists/artist.module';
import { AlbumModule } from '../albums/album.module';
import { TrackModule } from '../tracks/track.module';
import { Favorites } from './favorites.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorites]),
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesRepository],
  exports: [FavoritesService],
})
export class FavoritesModule {}
