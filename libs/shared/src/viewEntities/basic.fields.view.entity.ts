import { ViewColumn } from 'typeorm';

export class BasicFieldsViewEntity {
  @ViewColumn()
  id: number;

  @ViewColumn()
  versionId: number;

  @ViewColumn()
  createTime: number;

  @ViewColumn()
  updateTime: number;
}
