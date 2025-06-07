import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackRepository } from './track.repository';
import { FavoritesModule } from '../favorites/favorites.module';
import { Track } from './track.entity';

@Module({
  controllers: [TrackController],
  providers: [TrackService, TrackRepository],
  imports: [
    TypeOrmModule.forFeature([Track]),
    forwardRef(() => FavoritesModule),
  ],
  exports: [TrackService, TrackRepository],
})
export class TrackModule {}
