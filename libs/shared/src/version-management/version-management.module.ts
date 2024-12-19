import { Module } from '@nestjs/common';
import { VersionManagementService } from './version-management.service';
import { DbModule } from '@app/db';
import { UtilModule } from '../util/util.module';

@Module({
  imports: [UtilModule, DbModule],
  providers: [VersionManagementService],
  exports: [VersionManagementService],
})
export class VersionManagementModule {}
