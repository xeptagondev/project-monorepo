import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { VersionManagementModule } from './version-management/version-management.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [VersionManagementModule, UtilModule],
  providers: [SharedService],
  exports: [SharedService, VersionManagementModule, UtilModule],
})
export class SharedModule {}
