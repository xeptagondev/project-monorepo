import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class SortEntryDto {
  @IsNotEmpty()
  @ApiProperty()
  key: any;

  @IsNotEmpty()
  @ApiProperty()
  order: any;

  @ApiPropertyOptional()
  nullFirst?: boolean;
}
