import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Artist, CreateArtistDto, UpdateArtistDto } from './interfaces';
import { ArtistRepository } from './artist.repository';
import { validate as isUUID } from 'uuid';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ArtistService {
  constructor(private readonly repository: ArtistRepository) {}

  async create(dto: CreateArtistDto): Promise<Artist> {
    if (!dto.name || typeof dto.grammy !== 'boolean') {
      throw new BadRequestException('Name and grammy are required');
    }
    const artist = this.repository.create(dto);
    return plainToInstance(Artist, artist);
  }

  async findAll(): Promise<Artist[]> {
    const artists = this.repository.findAll();
    return artists.map((artist) => plainToInstance(Artist, artist));
  }

  async findById(id: string): Promise<Artist> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const artist = this.repository.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return plainToInstance(Artist, artist);
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const artist = this.repository.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    if (!dto.name || typeof dto.grammy !== 'boolean') {
      throw new BadRequestException('Name and grammy are required');
    }
    const updatedArtist = this.repository.update(id, dto);
    if (!updatedArtist) {
      throw new NotFoundException('Artist not found');
    }
    return plainToInstance(Artist, updatedArtist);
  }

  async delete(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const deleted = this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Artist not found');
    }
  }
}
