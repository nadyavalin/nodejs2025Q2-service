import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackRepository } from './track.repository';

@Module({
  controllers: [TrackController],
  providers: [TrackService, TrackRepository],
})
export class TrackModule {}
