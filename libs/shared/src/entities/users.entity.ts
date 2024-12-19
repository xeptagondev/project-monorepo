import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BasicFieldsEntity } from './basic.fields.entity';

@Entity()
export class UsersEntity extends BasicFieldsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  userName: string;

  @Column({ type: 'text' })
  password: string;
}
