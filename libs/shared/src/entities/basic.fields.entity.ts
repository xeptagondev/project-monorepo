import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class BasicFieldsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  versionId?: number;

  @Column({ type: 'bigint' })
  createTime: number;

  @Column({ type: 'bigint' })
  updateTime: number;

  @BeforeUpdate()
  async timestampAtUpdate() {
    this.updateTime = new Date().getTime();
  }

  @BeforeInsert()
  async timestampAtInsert() {
    const timestamp = new Date().getTime();
    this.createTime = timestamp;
    this.updateTime = timestamp;
  }
}
