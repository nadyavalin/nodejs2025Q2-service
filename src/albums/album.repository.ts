import { Injectable } from '@nestjs/common';
import { Album } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumRepository {
  private albums: Album[] = [];

  create(album: Omit<Album, 'id'>): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      ...album,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return this.albums;
  }

  findById(id: string): Album | undefined {
    return this.albums.find((album) => album.id === id);
  }

  update(id: string, data: Partial<Album>): Album | undefined {
    const album = this.findById(id);
    if (album) {
      Object.assign(album, data);
      return album;
    }
    return undefined;
  }

  delete(id: string): boolean {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index !== -1) {
      this.albums.splice(index, 1);
      return true;
    }
    return false;
  }
}
