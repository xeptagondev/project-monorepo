import { Injectable } from '@nestjs/common';
import { TransactionOptionsInterface } from '../interfaces/transaction.options.interface';
import { EntityManager } from 'typeorm';
import { EntityManagerInterface } from './entity.manager.interface';
import { TypeormDbConfigService } from '../db-config/typeorm-config/typeorm.db.config.service';

@Injectable()
export class TypeormEntityManagerService implements EntityManagerInterface {
  constructor(
    private readonly typeormDbConfigService: TypeormDbConfigService,
  ) {}

  private async getVersionEntityManager(
    versionId: number,
  ): Promise<EntityManager> {
    const schema = this.typeormDbConfigService.getSchemaFromVersion(versionId);
    const dataSource = await this.typeormDbConfigService.getSchemaDatasource(
      schema,
    );
    return dataSource.createEntityManager();
  }

  public async transaction(
    cb: (em: TransactionOptionsInterface) => any,
    versionId: number = 0,
  ): Promise<any> {
    const entityManager = await this.getVersionEntityManager(versionId);
    return entityManager.transaction(async (em) => {
      return await cb(em);
    });
  }
}
