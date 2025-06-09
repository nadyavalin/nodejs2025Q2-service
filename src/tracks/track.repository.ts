import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TrackRepository {
  constructor(
    @InjectRepository(Track)
    private readonly repository: Repository<Track>,
  ) {}

  async create(track: CreateTrackDto): Promise<Track> {
    const newTrack = this.repository.create(track);
    return this.repository.save(newTrack);
  }

  async findAll(): Promise<Track[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Track | undefined> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Track>): Promise<Track | undefined> {
    const track = await this.findById(id);
    if (track) {
      Object.assign(track, data);
      return this.repository.save(track);
    }
    return undefined;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
