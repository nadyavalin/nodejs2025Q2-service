import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Album, CreateAlbumDto, UpdateAlbumDto } from './interfaces';
import { AlbumRepository } from './album.repository';
import { validate as isUUID } from 'uuid';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AlbumService {
  constructor(private readonly repository: AlbumRepository) {}

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
  }
}
