import { Module, forwardRef } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistRepository } from './artist.repository';
import { FavoritesModule } from '../favorites/favorites.module';
import { AlbumModule } from '../albums/album.module';
import { TrackModule } from '../tracks/track.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, ArtistRepository],
  imports: [
    forwardRef(() => FavoritesModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
  ],
  exports: [ArtistService],
})
export class ArtistModule {}
