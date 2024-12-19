import { Column, Entity } from 'typeorm';
import { BasicFieldsEntity } from './basic.fields.entity';

@Entity()
export class VersionsEntity extends BasicFieldsEntity {
  @Column({ unique: true })
  versionCode: string;

  @Column()
  versionName: string;

  @Column({ default: 0 })
  fromVersionId: number;
}
