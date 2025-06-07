import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Artist } from '../artists/artist.entity';
import { Album } from '../albums/album.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  artistId: string | null;

  @Column({ nullable: true })
  albumId: string | null;

  @Column()
  duration: number;

  @ManyToOne(() => Artist, { nullable: true })
  artist: Artist;

  @ManyToOne(() => Album, { nullable: true })
  album: Album;
}
