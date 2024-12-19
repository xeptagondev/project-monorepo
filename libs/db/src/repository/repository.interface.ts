import { Injectable } from '@nestjs/common';
import { EntityOperationOptionsInterface } from '../interfaces/entity.operation.options.interface';
import { QueryDto } from '@app/shared/dtos/query.dto';
import { DataListResponseDto } from '@app/shared/dtos/data.list.response';

@Injectable()
export abstract class RepositoryInterface<T> {
  abstract findOne(
    options: EntityOperationOptionsInterface,
    versionId?: number,
  ): Promise<T>;

  abstract create(data: T, versionId: number): Promise<T>;

  update() {}

  delete() {}

  abstract count(
    options: EntityOperationOptionsInterface,
    versionId?: number,
  ): Promise<number>;

  abstract query(
    queryDto: QueryDto,
    versionId?: number,
  ): Promise<DataListResponseDto>;
}
