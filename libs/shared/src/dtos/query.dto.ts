import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { FilterEntryDto } from './filter.entry.dto';
import { SortEntryDto } from './sort.entry.dto';
import { FilterByDto } from './filter.by.dto';
import { Type } from 'class-transformer';
import { VersionDataFieldsDto } from './version.data.fields.dto';

export class QueryDto extends VersionDataFieldsDto {
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  @ValidateIf((o: QueryDto) => !o.allRecords)
  page: number;

  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional()
  @ValidateIf((o: QueryDto) => !o.allRecords)
  size: number;

  @ApiPropertyOptional({
    type: 'array',
    example: [{ key: 'age', operation: 'gt', value: 25 }],
    items: {
      $ref: getSchemaPath(FilterEntryDto),
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FilterEntryDto)
  filterAnd?: FilterEntryDto[];

  @ApiPropertyOptional({
    type: 'array',
    example: [{ key: 'age', operation: 'gt', value: 25 }],
    items: {
      $ref: getSchemaPath(FilterEntryDto),
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FilterEntryDto)
  filterOr?: FilterEntryDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SortEntryDto)
  sort?: SortEntryDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FilterByDto)
  filterBy?: FilterByDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allRecords?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  origin?: string;
}
