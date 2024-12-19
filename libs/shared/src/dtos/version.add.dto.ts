import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class VersionAddDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  versionCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  versionName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  fromVersionId?: number;
}
