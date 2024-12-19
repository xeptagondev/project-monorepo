import { Injectable } from '@nestjs/common';
import { TransactionOptionsInterface } from '../interfaces/transaction.options.interface';

@Injectable()
export abstract class EntityManagerInterface {
  abstract transaction(
    cb: (em: TransactionOptionsInterface) => any,
    versionId?: number,
  ): Promise<any>;
}
