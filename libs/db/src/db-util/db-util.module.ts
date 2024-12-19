import { Module } from '@nestjs/common';
import { DbUtilService } from './db-util.service';

@Module({
  providers: [DbUtilService],
  exports: [DbUtilService],
})
export class DbUtilModule {}
