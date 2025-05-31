import { Injectable } from '@nestjs/common';
import { Track } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackRepository {
  private tracks: Track[] = [];

  create(track: Omit<Track, 'id'>): Track {
    const newTrack: Track = {
      id: uuidv4(),
      ...track,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll(): Track[] {
    return this.tracks;
  }

  findById(id: string): Track | undefined {
    return this.tracks.find((track) => track.id === id);
  }

  update(id: string, data: Partial<Track>): Track | undefined {
    const track = this.findById(id);
    if (track) {
      Object.assign(track, data);
      return track;
    }
    return undefined;
  }

  delete(id: string): boolean {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index !== -1) {
      this.tracks.splice(index, 1);
      return true;
    }
    return false;
  }
}
