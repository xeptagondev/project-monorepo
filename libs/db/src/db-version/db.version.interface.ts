import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class DbVersionInterface {
  abstract createVersion(newVersionId: number, fromVersionId?: number): void;
}
