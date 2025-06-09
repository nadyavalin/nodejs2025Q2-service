import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorites } from './favorites.entity';
import { Artist } from '../artists/artist.entity';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';

@Injectable()
export class FavoritesRepository {
  constructor(
    @InjectRepository(Favorites)
    private readonly favoritesRepo: Repository<Favorites>,
  ) {}

  async getFavorites(): Promise<Favorites> {
    let favorites = await this.favoritesRepo.findOne({
      relations: ['artists', 'albums', 'tracks'],
    });
    if (!favorites) {
      favorites = this.favoritesRepo.create({
        artists: [],
        albums: [],
        tracks: [],
      });
      await this.favoritesRepo.save(favorites);
    }
    return favorites;
  }

  async addArtist(id: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    if (!favorites.artists.some((artist) => artist.id === id)) {
      favorites.artists.push({ id } as Artist);
      await this.favoritesRepo.save(favorites);
      return true;
    }
    return false;
  }

  async removeArtist(id: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    const index = favorites.artists.findIndex((artist) => artist.id === id);
    if (index !== -1) {
      favorites.artists.splice(index, 1);
      await this.favoritesRepo.save(favorites);
      return true;
    }
    return false;
  }

  async addAlbum(id: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    if (!favorites.albums.some((album) => album.id === id)) {
      favorites.albums.push({ id } as Album);
      await this.favoritesRepo.save(favorites);
      return true;
    }
    return false;
  }

  async removeAlbum(id: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    const index = favorites.albums.findIndex((album) => album.id === id);
    if (index !== -1) {
      favorites.albums.splice(index, 1);
      await this.favoritesRepo.save(favorites);
      return true;
    }
    return false;
  }

  async addTrack(id: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    if (!favorites.tracks.some((track) => track.id === id)) {
      favorites.tracks.push({ id } as Track);
      await this.favoritesRepo.save(favorites);
      return true;
    }
    return false;
  }

  async removeTrack(id: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    const index = favorites.tracks.findIndex((track) => track.id === id);
    if (index !== -1) {
      favorites.tracks.splice(index, 1);
      await this.favoritesRepo.save(favorites);
      return true;
    }
    return false;
  }
}
