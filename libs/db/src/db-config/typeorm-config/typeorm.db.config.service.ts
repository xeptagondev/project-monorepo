import { DbEntitiesConst } from '@app/db/db.entities.const';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeormDbConfigService {
  private datasourceMap: Record<string, DataSource> = {};

  constructor(private readonly configService: ConfigService) {}

  public async getSchemaDatasource(schema: string): Promise<DataSource> {
    if (this.datasourceMap[schema]) {
      const existingDatasource = this.datasourceMap[schema];
      if (existingDatasource.isInitialized) {
        return existingDatasource;
      }
    }
    const datasourceOptions = {
      ...this.configService.get('typeormDatabase'),
      schema: schema,
      entities: DbEntitiesConst,
    };
    const datasource = new DataSource(datasourceOptions);
    await datasource.initialize();
    this.datasourceMap[schema] = datasource;
    return datasource;
  }

  public getSchemaFromVersion(versionId: number): string {
    const schema = versionId
      ? `V${versionId}`
      : this.configService.get('typeormDatabase').schema;
    return schema;
  }
}
