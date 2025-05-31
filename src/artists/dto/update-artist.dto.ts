import { IsString, IsBoolean, IsNotEmpty, IsDefined } from 'class-validator';

export class UpdateArtistDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @IsBoolean()
  @IsDefined()
  grammy: boolean;
}
