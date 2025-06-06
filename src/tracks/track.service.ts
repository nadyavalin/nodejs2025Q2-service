import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Track } from './track.entity'; // Заменили interfaces на entity
import { TrackRepository } from './track.repository';
import { validate as isUUID } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { FavoritesService } from '../favorites/favorites.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

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
    const track = await this.repository.create(dto); // Добавили await
    return plainToInstance(Track, track);
  }

  async findAll(): Promise<Track[]> {
    const tracks = await this.repository.findAll(); // Добавили await
    return tracks.map((track) => plainToInstance(Track, track));
  }

  async findById(id: string): Promise<Track> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const track = await this.repository.findById(id); // Добавили await
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return plainToInstance(Track, track);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const track = await this.repository.findById(id); // Добавили await
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
    const updatedTrack = await this.repository.update(id, dto); // Добавили await
    if (!updatedTrack) {
      throw new NotFoundException('Track not found');
    }
    return plainToInstance(Track, updatedTrack);
  }

  async delete(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const deleted = await this.repository.delete(id); // Добавили await
    if (!deleted) {
      throw new NotFoundException('Track not found');
    }

    await this.favoritesService.removeTrackOnDelete(id);
  }

  async clearArtistReferences(artistId: string): Promise<void> {
    const tracks = await this.repository.findAll(); // Добавили await
    tracks.forEach(async (track) => {
      if (track.artistId === artistId) {
        await this.repository.update(track.id, { artistId: null }); // Добавили await
      }
    });
  }

  async clearAlbumReferences(albumId: string): Promise<void> {
    const tracks = await this.repository.findAll(); // Добавили await
    tracks.forEach(async (track) => {
      if (track.albumId === albumId) {
        await this.repository.update(track.id, { albumId: null }); // Добавили await
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
