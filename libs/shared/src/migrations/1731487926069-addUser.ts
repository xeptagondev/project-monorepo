import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUser1731487926069 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const initTime = new Date().getTime();
    await queryRunner.query(`
            INSERT INTO 
            users_entity 
            ("userName","password","createTime","updateTime","versionId")
            VALUES 
            ('testUser','abc123',${initTime},${initTime},0)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM
      users_entity`);
  }
}
