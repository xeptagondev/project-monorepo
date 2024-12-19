import { Injectable } from '@nestjs/common';
import { RepositoryInterface } from './repository.interface';
import { Repository } from 'typeorm';
import { EntityOperationOptionsInterface } from '../interfaces/entity.operation.options.interface';
import { QueryDto } from '@app/shared/dtos/query.dto';
import { DataListResponseDto } from '@app/shared/dtos/data.list.response';
import { DbUtilService } from '../db-util/db-util.service';
import { TypeormDbConfigService } from '../db-config/typeorm-config/typeorm.db.config.service';

@Injectable()
export class TypeormRepository<T> implements RepositoryInterface<T> {
  constructor(
    private readonly entity: { new (): T },
    private readonly dbUtilService: DbUtilService,
    private readonly typeormDbConfigService: TypeormDbConfigService,
  ) {}

  private async getVersionRepository(
    versionId: number,
  ): Promise<Repository<T>> {
    const schema = this.typeormDbConfigService.getSchemaFromVersion(versionId);
    const dataSource = await this.typeormDbConfigService.getSchemaDatasource(
      schema,
    );
    return dataSource.getRepository(this.entity);
  }

  public async findOne(
    options: EntityOperationOptionsInterface,
    versionId: number = 0,
  ): Promise<T> {
    const repo = await this.getVersionRepository(versionId);
    return repo.findOne(options);
  }

  public async create(data: T, versionId: number = 0): Promise<T> {
    const repo = await this.getVersionRepository(versionId);
    return repo.save(data);
  }

  update() {}

  delete() {}

  public async count(
    options: EntityOperationOptionsInterface,
    versionId: number = 0,
  ): Promise<number> {
    const repo = await this.getVersionRepository(versionId);
    return repo.count({ where: options.where });
  }

  public async query(
    query: QueryDto,
    versionId: number = 0,
  ): Promise<DataListResponseDto> {
    const repo = await this.getVersionRepository(versionId);
    let queryBuilder = repo
      .createQueryBuilder()
      .where(this.dbUtilService.generateWhereSQL(query))
      .orderBy(
        query?.sort?.key && `"${query?.sort?.key}"`,
        query?.sort?.order,
        query?.sort?.nullFirst !== undefined
          ? query?.sort?.nullFirst === true
            ? 'NULLS FIRST'
            : 'NULLS LAST'
          : undefined,
      );
    const countQuery = queryBuilder.getQuery();

    const updatedCountQuery = countQuery.replace(
      /^SELECT\s+.+?\s+FROM\s+("[^"]+"\."[^"]+"\s+"[^"]+")/,
      'SELECT COUNT(*) FROM $1',
    );
    const countRes = await repo.query(updatedCountQuery);

    if (!query.allRecords) {
      queryBuilder = queryBuilder
        .offset(query.size * query.page - query.size)
        .limit(query.size);
    }
    const rawQuery = queryBuilder.getQuery();
    const transformedQuery = rawQuery.replace(
      /"([^"]+)"\."([^"]+)"\s+AS\s+"[^"]+"/g,
      '"$1"."$2"',
    );
    const res = await repo.query(transformedQuery);
    const resp = [res, parseInt(countRes[0].count)];
    return new DataListResponseDto(
      resp.length > 0 ? resp[0] : undefined,
      resp.length > 1 ? resp[1] : undefined,
    );
  }
}
