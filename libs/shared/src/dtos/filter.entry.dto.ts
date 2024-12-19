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
import { QueryActionDto } from './query.action.dto';

export class FilterEntryDto {
  @IsNotEmpty()
  @ApiPropertyOptional()
  @IsOptional()
  key?: any;

  @IsNotEmpty()
  @ApiProperty()
  value: any;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  operation?: any;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  keyOperation?: any;

  @ApiPropertyOptional()
  @IsOptional()
  action?: QueryActionDto;

  // @IsNotEmpty()
  // @IsString()
  // @ApiPropertyOptional()
  // @IsOptional()
  // keyOperationAttr?: any;
}
