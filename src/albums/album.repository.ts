import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumRepository {
  constructor(
    @InjectRepository(Album)
    private readonly repository: Repository<Album>,
  ) {}

  async create(album: CreateAlbumDto): Promise<Album> {
    const newAlbum = this.repository.create(album);
    return this.repository.save(newAlbum);
  }

  async findAll(): Promise<Album[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Album | undefined> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Album>): Promise<Album | undefined> {
    const album = await this.findById(id);
    if (album) {
      Object.assign(album, data);
      return this.repository.save(album);
    }
    return undefined;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
