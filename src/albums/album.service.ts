import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Album } from './interfaces';
import { AlbumRepository } from './album.repository';
import { validate as isUUID } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { FavoritesService } from '../favorites/favorites.service';
import { TrackService } from '../tracks/track.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  private favoritesService: FavoritesService;

  constructor(
    private readonly repository: AlbumRepository,
    private readonly trackService: TrackService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    this.favoritesService = await this.moduleRef.get(FavoritesService, {
      strict: false,
    });
  }

  async create(dto: CreateAlbumDto): Promise<Album> {
    if (!dto.name || typeof dto.year !== 'number') {
      throw new BadRequestException('Name and year are required');
    }
    if (dto.artistId && !isUUID(dto.artistId)) {
      throw new BadRequestException('Invalid artistId UUID');
    }
    const album = this.repository.create(dto);
    return plainToInstance(Album, album);
  }

  async findAll(): Promise<Album[]> {
    const albums = this.repository.findAll();
    return albums.map((album) => plainToInstance(Album, album));
  }

  async findById(id: string): Promise<Album> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const album = this.repository.findById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return plainToInstance(Album, album);
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const album = this.repository.findById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    if (!dto.name || typeof dto.year !== 'number') {
      throw new BadRequestException('Name and year are required');
    }
    if (dto.artistId && !isUUID(dto.artistId)) {
      throw new BadRequestException('Invalid artistId UUID');
    }
    const updatedAlbum = this.repository.update(id, dto);
    if (!updatedAlbum) {
      throw new NotFoundException('Album not found');
    }
    return plainToInstance(Album, updatedAlbum);
  }

  async delete(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const deleted = this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Album not found');
    }

    await this.favoritesService.removeAlbumOnDelete(id);
    await this.trackService.clearAlbumReferences(id);
  }

  async clearArtistReferences(artistId: string): Promise<void> {
    const albums = this.repository.findAll();
    albums.forEach((album) => {
      if (album.artistId === artistId) {
        this.repository.update(album.id, { artistId: null });
      }
    });
  }

  async getById(id: string): Promise<Album | null> {
    try {
      return await this.findById(id);
    } catch {
      return null;
    }
  }
}
