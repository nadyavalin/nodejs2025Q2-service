import { IsString, IsBoolean, IsNotEmpty, IsDefined } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @IsBoolean()
  @IsDefined()
  grammy: boolean;
}
