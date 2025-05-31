import { IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  newPassword: string;
}
