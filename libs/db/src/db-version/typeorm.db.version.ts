import { DataSource, QueryRunner } from 'typeorm';
import { DbVersionInterface } from './db.version.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TypeormDbConfigService } from '../db-config/typeorm-config/typeorm.db.config.service';

export class TypeormDbVersion implements DbVersionInterface {
  constructor(
    private dataSource: DataSource,
    private readonly typeormDbConfigService: TypeormDbConfigService,
  ) {}
  private async copySequences(
    queryRunner: QueryRunner,
    fromSchema: string,
    toSchema: string,
  ): Promise<void> {
    const sequences = await queryRunner.query(
      `
    SELECT schemaname, sequencename, start_value, increment_by, max_value, min_value, cycle
    FROM pg_sequences
    WHERE schemaname = $1
  `,
      [fromSchema],
    );
    for (const sequence of sequences) {
      const {
        sequencename,
        start_value,
        increment_by,
        max_value,
        min_value,
        cycle,
      } = sequence;

      const createSequenceSQL = `
      CREATE SEQUENCE "${toSchema}"."${sequencename}"
      START WITH ${start_value}
      INCREMENT BY ${increment_by}
      MINVALUE ${min_value}
      MAXVALUE ${max_value}
      ${cycle ? 'CYCLE' : 'NO CYCLE'};
    `;
      await queryRunner.query(createSequenceSQL);
      const lastVal = await queryRunner.query(`SELECT last_value
            FROM "${fromSchema}"."${sequencename}"`);
      const setValSQL = `
      SELECT setval('"${toSchema}"."${sequencename}"', ${lastVal[0].last_value}, true);
    `;
      await queryRunner.query(setValSQL);
    }
  }

  private async copyViews(queryRunner: QueryRunner, toSchema: string) {
    const views = await queryRunner.query(
      `
    SELECT viewname, definition
    FROM pg_views
    WHERE schemaname = $1;
  `,
      [this.typeormDbConfigService.getSchemaFromVersion(0)],
    );
    for (const view of views) {
      const { viewname, definition } = view;
      const createViewQuery = `
      CREATE OR REPLACE VIEW "${toSchema}"."${viewname}" AS ${definition}
    `;
      const updatedQuery = createViewQuery.replace(
        /FROM\s+(\w+);/,
        `FROM "${toSchema}".$1`,
      );
      await queryRunner.query(updatedQuery);
    }
  }

  private async copyEnums(queryRunner: QueryRunner, toSchema: string) {
    const enumTypes = await queryRunner.query(
      `
    SELECT
      n.nspname AS schema_name,
      t.typname AS type_name,
      array_agg(e.enumlabel ORDER BY e.enumsortorder) AS enum_values
    FROM
      pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE
      n.nspname = $1
    GROUP BY
      n.nspname, t.typname;
  `,
      [this.typeormDbConfigService.getSchemaFromVersion(0)],
    );

    for (const enumType of enumTypes) {
      const { type_name, enum_values } = enumType;

      // Create the enum type in the target schema
      const jsArray = enum_values.slice(1, -1).split(',');
      const enumDefinition = jsArray.map((value) => `'${value}'`).join(', ');
      await queryRunner.query(`
      CREATE TYPE "${toSchema}"."${type_name}" AS ENUM (${enumDefinition});
    `);
    }
  }

  private async copyTablesWithData(
    queryRunner: QueryRunner,
    fromSchema: string,
    toSchema: string,
    newVersionId: number,
  ) {
    const entities = this.dataSource.entityMetadatas;
    for (const entity of entities) {
      if (
        entity.schema === this.typeormDbConfigService.getSchemaFromVersion(0) &&
        entity.tableType == 'regular'
      ) {
        const tableName = entity.tableName;
        await queryRunner.query(`
                    CREATE TABLE "${toSchema}"."${tableName}" AS
                    TABLE "${fromSchema}"."${tableName}" WITH NO DATA;
                `);
        await queryRunner.query(`
                        INSERT INTO "${toSchema}"."${tableName}" SELECT * FROM "${fromSchema}"."${tableName}";
                `);
        await queryRunner.query(`
                        UPDATE "${toSchema}"."${tableName}" SET "versionId"=${newVersionId};
                `);
      }
    }
  }

  public async createVersion(newVersionId: number, fromVersionId?: number) {
    const fromSchema =
      this.typeormDbConfigService.getSchemaFromVersion(fromVersionId);
    const toSchema =
      this.typeormDbConfigService.getSchemaFromVersion(newVersionId);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${toSchema}"`);
      await this.copyTablesWithData(
        queryRunner,
        fromSchema,
        toSchema,
        newVersionId,
      );
      await this.copyEnums(queryRunner, toSchema);
      await this.copyViews(queryRunner, toSchema);
      await this.copySequences(queryRunner, fromSchema, toSchema);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
}
