import { ViewColumn, ViewEntity } from 'typeorm';
import { BasicFieldsViewEntity } from './basic.fields.view.entity';

@ViewEntity({
  synchronize: false,
})
export class UsersViewEntity extends BasicFieldsViewEntity {
  @ViewColumn()
  userName: string;
}
