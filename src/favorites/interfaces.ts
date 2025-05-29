import { Album } from '../albums/interfaces';
import { Artist } from '../artists/interfaces';
import { Track } from '../tracks/interfaces';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
