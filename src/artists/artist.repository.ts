import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistRepository {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
  ) {}

  async create(artist: CreateArtistDto): Promise<Artist> {
    const newArtist = this.artistRepo.create(artist);
    return this.artistRepo.save(newArtist);
  }

  async findAll(): Promise<Artist[]> {
    return this.artistRepo.find();
  }

  async findById(id: string): Promise<Artist | undefined> {
    return this.artistRepo.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Artist>): Promise<Artist | undefined> {
    const artist = await this.findById(id);
    if (artist) {
      Object.assign(artist, data);
      return this.artistRepo.save(artist);
    }
    return undefined;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.artistRepo.delete(id);
    return result.affected > 0;
  }
}
