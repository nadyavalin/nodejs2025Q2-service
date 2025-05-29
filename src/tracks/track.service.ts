import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Track, CreateTrackDto, UpdateTrackDto } from './interfaces';
import { TrackRepository } from './track.repository';
import { validate as isUUID } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TrackService {
  private favoritesService: FavoritesService;

  constructor(
    private readonly repository: TrackRepository,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    this.favoritesService = await this.moduleRef.get(FavoritesService, {
      strict: false,
    });
  }

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

    await this.favoritesService.removeTrackOnDelete(id);
  }

  async clearArtistReferences(artistId: string): Promise<void> {
    const tracks = this.repository.findAll();
    tracks.forEach((track) => {
      if (track.artistId === artistId) {
        this.repository.update(track.id, { artistId: null });
      }
    });
  }

  async clearAlbumReferences(albumId: string): Promise<void> {
    const tracks = this.repository.findAll();
    tracks.forEach((track) => {
      if (track.albumId === albumId) {
        this.repository.update(track.id, { albumId: null });
      }
    });
  }

  async getById(id: string): Promise<Track | null> {
    try {
      return await this.findById(id);
    } catch {
      return null;
    }
  }
}
