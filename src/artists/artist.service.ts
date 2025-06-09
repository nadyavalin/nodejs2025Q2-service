import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Artist } from './artist.entity';
import { ArtistRepository } from './artist.repository';
import { validate as isUUID } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { FavoritesService } from '../favorites/favorites.service';
import { AlbumRepository } from '../albums/album.repository';
import { TrackRepository } from '../tracks/track.repository';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  private favoritesService: FavoritesService;

  constructor(
    private readonly repository: ArtistRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly trackRepository: TrackRepository,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    this.favoritesService = await this.moduleRef.get(FavoritesService, {
      strict: false,
    });
  }

  async create(dto: CreateArtistDto): Promise<Artist> {
    if (!dto.name || typeof dto.grammy !== 'boolean') {
      throw new BadRequestException('Name and grammy are required');
    }
    const artist = await this.repository.create(dto);
    return plainToInstance(Artist, artist);
  }

  async findAll(): Promise<Artist[]> {
    const artists = await this.repository.findAll();
    return artists.map((artist) => plainToInstance(Artist, artist));
  }

  async findById(id: string): Promise<Artist> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const artist = await this.repository.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return plainToInstance(Artist, artist);
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const artist = await this.repository.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    if (typeof dto.name !== 'string' || typeof dto.grammy !== 'boolean') {
      throw new BadRequestException(
        'Name must be a string and grammy must be a boolean',
      );
    }
    if (!dto.name) {
      throw new BadRequestException('Name is required');
    }
    const updatedArtist = await this.repository.update(id, dto);
    if (!updatedArtist) {
      throw new NotFoundException('Artist not found');
    }
    return plainToInstance(Artist, updatedArtist);
  }

  async delete(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Artist not found');
    }

    await this.favoritesService.removeArtist(id);
    const albums = await this.albumRepository.findAll();
    albums.forEach(async (album) => {
      if (album.artistId === id) {
        await this.albumRepository.update(album.id, { artistId: null });
      }
    });
    const tracks = await this.trackRepository.findAll();
    tracks.forEach(async (track) => {
      if (track.artistId === id) {
        await this.trackRepository.update(track.id, { artistId: null });
      }
    });
  }

  async getById(id: string): Promise<Artist | null> {
    try {
      return await this.findById(id);
    } catch {
      return null;
    }
  }
}
