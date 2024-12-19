import { Body, Controller, Post } from '@nestjs/common';
import { VersionManagementService } from '@app/shared/version-management/version-management.service';
import { VersionAddDto } from '@app/shared/dtos/version.add.dto';

@Controller('versionManagement')
export class VersionManagementController {
  constructor(
    private readonly versionManagementService: VersionManagementService,
  ) {}
  @Post('addVersion')
  async addVersion(@Body() versionAddDto: VersionAddDto): Promise<any> {
    return this.versionManagementService.addNewVersion(versionAddDto);
  }
}
