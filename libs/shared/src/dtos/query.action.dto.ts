import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { QueryActionEnum } from '../enums/query.action.enum';

export class QueryActionDto {
  @IsNotEmpty()
  @IsEmail()
  type: QueryActionEnum;

  @IsOptional()
  @IsString()
  dataType: string;
}
