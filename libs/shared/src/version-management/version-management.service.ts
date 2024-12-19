import { DbVersionInterface } from '@app/db/db-version/db.version.interface';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EntityRepositoryName } from '@app/db/repository/entity.repository.name.function';
import { VersionsEntity } from '../entities/versions.entity';
import { RepositoryInterface } from '@app/db/repository/repository.interface';
import { HelperService } from '../util/helper.service';
import { plainToClass } from 'class-transformer';
import { DataResponseDto } from '../dtos/data.response.dto';
import { VersionAddDto } from '../dtos/version.add.dto';

@Injectable()
export class VersionManagementService {
  constructor(
    private readonly helperService: HelperService,
    private dbVersionInterface: DbVersionInterface,
    @Inject(EntityRepositoryName(VersionsEntity))
    private versionsEntityRepository: RepositoryInterface<VersionsEntity>,
  ) {}
  public async addNewVersion(
    versionAddDto: VersionAddDto,
  ): Promise<DataResponseDto> {
    try {
      await this.validateAddVersionReq(versionAddDto);
      const newVersion = plainToClass(VersionsEntity, {
        ...versionAddDto,
        versionId: 0,
      });
      const saved = await this.versionsEntityRepository.create(newVersion, 0);
      await this.dbVersionInterface.createVersion(
        saved.id,
        versionAddDto.fromVersionId,
      );
      return new DataResponseDto(HttpStatus.OK, saved);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  private async validateAddVersionReq(versionAddDto: VersionAddDto) {
    const existingVersion = await this.versionsEntityRepository.findOne(
      {
        where: { versionCode: versionAddDto.versionCode },
      },
      0,
    );
    if (existingVersion) {
      throw new HttpException(
        this.helperService.formatReqMessagesString(
          'version.versionAlreadyExists',
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
    if (versionAddDto.fromVersionId) {
      const fromVersion = await this.versionsEntityRepository.findOne(
        {
          where: { id: versionAddDto.fromVersionId },
        },
        0,
      );
      if (!fromVersion) {
        throw new HttpException(
          this.helperService.formatReqMessagesString(
            'version.fromVersionDoesNotExist',
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
