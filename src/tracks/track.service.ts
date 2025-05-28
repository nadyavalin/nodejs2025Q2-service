import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Track, CreateTrackDto, UpdateTrackDto } from './interfaces';
import { TrackRepository } from './track.repository';
import { validate as isUUID } from 'uuid';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TrackService {
  constructor(private readonly repository: TrackRepository) {}

  async create(dto: CreateTrackDto): Promise<Track> {
    if (!dto.name || typeof dto.duration !== 'number') {
      throw new BadRequestException('Name and duration are required');
    }
    if (dto.artistId && !isUUID(dto.artistId)) {
      throw new BadRequestException('Invalid artistId UUID');
    }
    if (dto.albumId && !isUUID(dto.albumId)) {
      throw new BadRequestException('Invalid albumId UUID');
    }
    const track = this.repository.create(dto);
    return plainToInstance(Track, track);
  }

  async findAll(): Promise<Track[]> {
    const tracks = this.repository.findAll();
    return tracks.map((track) => plainToInstance(Track, track));
  }

  async findById(id: string): Promise<Track> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const track = this.repository.findById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return plainToInstance(Track, track);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const track = this.repository.findById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    if (!dto.name || typeof dto.duration !== 'number') {
      throw new BadRequestException('Name and duration are required');
    }
    if (dto.artistId && !isUUID(dto.artistId)) {
      throw new BadRequestException('Invalid artistId UUID');
    }
    if (dto.albumId && !isUUID(dto.albumId)) {
      throw new BadRequestException('Invalid albumId UUID');
    }
    const updatedTrack = this.repository.update(id, dto);
    if (!updatedTrack) {
      throw new NotFoundException('Track not found');
    }
    return plainToInstance(Track, updatedTrack);
  }

  async delete(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const deleted = this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Track not found');
    }
  }
}
