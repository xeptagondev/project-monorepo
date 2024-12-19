import { ApiProperty } from '@nestjs/swagger';
import { VersionDataFieldsDto } from './version.data.fields.dto';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class LoginDto extends VersionDataFieldsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
