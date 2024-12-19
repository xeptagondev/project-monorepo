import { EntityRepositoryName } from '@app/db/repository/entity.repository.name.function';
import { RepositoryInterface } from '@app/db/repository/repository.interface';
import { DataListResponseDto } from '@app/shared/dtos/data.list.response';
import { DataResponseDto } from '@app/shared/dtos/data.response.dto';
import { LoginDto } from '@app/shared/dtos/login.dto';
import { QueryDto } from '@app/shared/dtos/query.dto';
import { UsersEntity } from '@app/shared/entities/users.entity';
import { HelperService } from '@app/shared/util/helper.service';
import { UsersViewEntity } from '@app/shared/viewEntities/users.view.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(EntityRepositoryName(UsersEntity))
    private readonly usersEntityRepository: RepositoryInterface<UsersEntity>,
    @Inject(EntityRepositoryName(UsersViewEntity))
    private readonly usersViewEntityRepository: RepositoryInterface<UsersViewEntity>,
    private readonly helperService: HelperService,
  ) {}

  async login(loginDto: LoginDto): Promise<DataResponseDto> {
    const validated = await this.usersEntityRepository.count(
      {
        where: { id: loginDto.id, password: loginDto.password },
      },
      loginDto.versionId,
    );
    if (validated) {
      return new DataResponseDto(
        HttpStatus.OK,
        await this.jwtService.signAsync({
          userId: loginDto.id,
          versionId: loginDto.versionId,
        }),
      );
    } else {
      throw new HttpException(
        this.helperService.formatReqMessagesString(
          'auth.invalidLoginCredentials',
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getContent(): string {
    return this.helperService.formatReqMessagesString('common.translationKey');
  }

  public async queryUserData(query: QueryDto): Promise<DataListResponseDto> {
    try {
      return await this.usersViewEntityRepository.query(query, query.versionId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
