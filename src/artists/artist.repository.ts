import { Injectable } from '@nestjs/common';
import { Artist } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistRepository {
  private artists: Artist[] = [];

  create(artist: Omit<Artist, 'id'>): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      ...artist,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findById(id: string): Artist | undefined {
    return this.artists.find((artist) => artist.id === id);
  }

  update(id: string, data: Partial<Artist>): Artist | undefined {
    const artist = this.findById(id);
    if (artist) {
      Object.assign(artist, data);
      return artist;
    }
    return undefined;
  }

  delete(id: string): boolean {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index !== -1) {
      this.artists.splice(index, 1);
      return true;
    }
    return false;
  }
}
