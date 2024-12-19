import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class FilterByDto {
  @IsNotEmpty()
  @ApiPropertyOptional()
  @IsOptional()
  key: any;

  @IsNotEmpty()
  @ApiProperty()
  value: any[];
}
