import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { VersionManagementController } from './version.management.controller';

@Module({
  imports: [CoreModule, SharedModule],
  controllers: [SystemController, VersionManagementController],
  providers: [SystemService],
})
export class SystemModule {}
