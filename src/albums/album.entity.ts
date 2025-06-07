import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Artist } from '../artists/artist.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => Artist, { nullable: true })
  artist: Artist;
}
