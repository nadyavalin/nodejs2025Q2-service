import { Injectable } from '@nestjs/common';
import { Favorites } from './interfaces';

@Injectable()
export class FavoritesRepository {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  getFavorites(): Favorites {
    return this.favorites;
  }

  addArtist(id: string): boolean {
    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
      return true;
    }
    return false;
  }

  removeArtist(id: string): boolean {
    const index = this.favorites.artists.indexOf(id);
    if (index !== -1) {
      this.favorites.artists.splice(index, 1);
      return true;
    }
    return false;
  }

  addAlbum(id: string): boolean {
    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
      return true;
    }
    return false;
  }

  removeAlbum(id: string): boolean {
    const index = this.favorites.albums.indexOf(id);
    if (index !== -1) {
      this.favorites.albums.splice(index, 1);
      return true;
    }
    return false;
  }

  addTrack(id: string): boolean {
    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
      return true;
    }
    return false;
  }

  removeTrack(id: string): boolean {
    const index = this.favorites.tracks.indexOf(id);
    if (index !== -1) {
      this.favorites.tracks.splice(index, 1);
      return true;
    }
    return false;
  }
}
