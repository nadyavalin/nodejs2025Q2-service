import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { FavoritesRepository } from './favorites.repository';
import { FavoritesResponse } from './interfaces';
import { validate as isUUID } from 'uuid';
import { ArtistService } from '../artists/artist.service';
import { AlbumService } from '../albums/album.service';
import { TrackService } from '../tracks/track.service';

@Injectable()
export class FavoritesService {
  private artistService: ArtistService;

  constructor(
    private readonly favoritesRepository: FavoritesRepository,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    this.artistService = await this.moduleRef.get(ArtistService, {
      strict: false,
    });
  }

  async getFavorites(): Promise<FavoritesResponse> {
    const favorites = await this.favoritesRepository.getFavorites();
    const artists = await Promise.all(
      favorites.artists.map((artist) =>
        this.artistService.getById(artist.id).catch(() => null),
      ),
    ).then((results) => results.filter((artist) => artist !== null));
    const albums = await Promise.all(
      favorites.albums.map((album) =>
        this.albumService.getById(album.id).catch(() => null),
      ),
    ).then((results) => results.filter((album) => album !== null));
    const tracks = await Promise.all(
      favorites.tracks.map((track) =>
        this.trackService.getById(track.id).catch(() => null),
      ),
    ).then((results) => results.filter((track) => track !== null));

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addArtist(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const artist = await this.artistService.getById(id).catch(() => {
      throw new UnprocessableEntityException('Artist does not exist');
    });
    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }
    const added = await this.favoritesRepository.addArtist(id);
    if (!added) {
      throw new BadRequestException('Artist already in favorites');
    }
  }

  async removeArtist(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const removed = await this.favoritesRepository.removeArtist(id);
    if (!removed) {
      throw new NotFoundException('Artist not in favorites');
    }
  }

  async addAlbum(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const album = await this.albumService.getById(id).catch(() => {
      throw new UnprocessableEntityException('Album does not exist');
    });
    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }
    const added = await this.favoritesRepository.addAlbum(id);
    if (!added) {
      throw new BadRequestException('Album already in favorites');
    }
  }

  async removeAlbum(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const removed = await this.favoritesRepository.removeAlbum(id);
    if (!removed) {
      throw new NotFoundException('Album not in favorites');
    }
  }

  async addTrack(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const track = await this.trackService.getById(id).catch(() => {
      throw new UnprocessableEntityException('Track does not exist');
    });
    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }
    const added = await this.favoritesRepository.addTrack(id);
    if (!added) {
      throw new BadRequestException('Track already in favorites');
    }
  }

  async removeTrack(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const removed = await this.favoritesRepository.removeTrack(id);
    if (!removed) {
      throw new NotFoundException('Track not in favorites');
    }
  }

  async removeTrackOnDelete(id: string): Promise<void> {
    await this.favoritesRepository.removeTrack(id);
  }

  async removeAlbumOnDelete(id: string): Promise<void> {
    await this.favoritesRepository.removeAlbum(id);
  }
}
