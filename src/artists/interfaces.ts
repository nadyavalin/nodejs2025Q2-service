import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class Artist {
  id: string;
  name: string;
  grammy: boolean;
}

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  grammy: boolean;
}

export class UpdateArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  grammy: boolean;
}
