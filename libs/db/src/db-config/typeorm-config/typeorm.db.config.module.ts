import { Module, Provider } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DbEntitiesConst } from '@app/db/db.entities.const';
import { DataSource } from 'typeorm';
import { TypeormRepository } from '@app/db/repository/typeorm.repository';
import { EntityRepositoryName } from '../../repository/entity.repository.name.function';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AddUser1731487926069 } from '@app/shared/migrations/1731487926069-addUser';
import { DbUtilModule } from '../../db-util/db-util.module';
import { DbUtilService } from '../../db-util/db-util.service';
import { EntityManagerInterface } from '../../entity-manager/entity.manager.interface';
import { TypeormEntityManagerService } from '../../entity-manager/typeorm.entity.manager.service';
import { TypeormDbVersion } from '../../db-version/typeorm.db.version';
import { DbVersionInterface } from '../../db-version/db.version.interface';
import { TypeormDbConfigService } from './typeorm.db.config.service';
import { AddUserView1731487926070 } from '@app/shared/migrations/1731487926070-addUserView';

function createRepositoryProvider<T>(entities: any[]): Provider[] {
  return entities.map((entity) => {
    return {
      provide: EntityRepositoryName(entity),
      useFactory: (
        dbUtilService: DbUtilService,
        typeormDbConfigService: TypeormDbConfigService,
      ) =>
        new TypeormRepository<T>(entity, dbUtilService, typeormDbConfigService),
      inject: [DbUtilService, TypeormDbConfigService],
    };
  });
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          ...configService.get('typeormDatabase'),
          migrations: [AddUser1731487926069, AddUserView1731487926070],
          migrationsRun: false,
          migrationsTableName: 'typeorm_migrations_entity',
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(DbEntitiesConst),
    DbUtilModule,
  ],
  providers: [
    TypeormDbConfigService,
    ...createRepositoryProvider(DbEntitiesConst),
    {
      provide: EntityManagerInterface,
      useClass: TypeormEntityManagerService,
    },
    {
      provide: DbVersionInterface,
      useFactory: (
        datasource: DataSource,
        typeormDbConfigService: TypeormDbConfigService,
      ) => new TypeormDbVersion(datasource, typeormDbConfigService),
      inject: [DataSource, TypeormDbConfigService],
    },
  ],
  exports: [
    ...DbEntitiesConst.map((entity) => EntityRepositoryName(entity)),
    EntityManagerInterface,
    DbVersionInterface,
  ],
})
export class TypeormDbConfigModule {}
