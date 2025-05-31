import { Module, forwardRef } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { AlbumRepository } from './album.repository';
import { FavoritesModule } from '../favorites/favorites.module';
import { TrackModule } from '../tracks/track.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository],
  imports: [forwardRef(() => FavoritesModule), forwardRef(() => TrackModule)],
  exports: [AlbumService, AlbumRepository],
})
export class AlbumModule {}
