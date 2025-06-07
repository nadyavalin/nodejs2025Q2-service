import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { AlbumRepository } from './album.repository';
import { FavoritesModule } from '../favorites/favorites.module';
import { TrackModule } from '../tracks/track.module';
import { Album } from './album.entity';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository],
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => FavoritesModule),
    forwardRef(() => TrackModule),
  ],
  exports: [AlbumService, AlbumRepository],
})
export class AlbumModule {}
