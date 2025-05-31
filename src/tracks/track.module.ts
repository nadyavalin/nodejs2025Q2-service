import { Module, forwardRef } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackRepository } from './track.repository';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService, TrackRepository],
  imports: [forwardRef(() => FavoritesModule)],
  exports: [TrackService, TrackRepository],
})
export class TrackModule {}
