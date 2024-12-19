import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserView1731487926070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE VIEW users_view_entity AS
    SELECT 
        user_data."id",
        user_data."versionId",
        user_data."createTime",
        user_data."updateTime",
        user_data."userName"
    FROM 
        users_entity AS user_data;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
