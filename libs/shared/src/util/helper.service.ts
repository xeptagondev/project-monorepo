import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import {
  I18N_OPTIONS,
  I18nContext,
  I18nOptions,
  I18nService,
} from 'nestjs-i18n';
import {
  ClassConstructor,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import {
  MiliSecsInHour,
  MiliSecsInMinute,
  MiliSecsInSecond,
} from '../constants/mili.seconds.const';
import { validate } from 'class-validator';
import { QueryDto } from '../dtos/query.dto';
import { QueryActionEnum } from '../enums/query.action.enum';
import { TransactionOptionsInterface } from '@app/db/interfaces/transaction.options.interface';

@Injectable()
export class HelperService {
  constructor(
    @Inject(I18N_OPTIONS)
    private readonly i18nOptions: I18nOptions,
    private i18n: I18nService,
  ) {}

  public async expectUpdatedRecordCount(
    em: any, //TODO add proper type
    entity: any,
    where: object,
    data: object,
    count = 1,
  ): Promise<void> {
    const updatedRes = await em.update(entity, where, data);
    if (updatedRes.affected != count) {
      throw new HttpException(
        this.formatReqMessagesString('common.internalServerError'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async validateUsingDto(
    obj: object,
    dtoClass: ClassConstructor<object>,
  ): Promise<boolean> {
    const dto = plainToInstance(dtoClass, obj);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }
    return true;
  }

  public miliSecondsToTimeString(miliSeconds: number) {
    const hours = Math.floor(miliSeconds / MiliSecsInHour);
    const minutes = Math.floor(
      (miliSeconds - hours * MiliSecsInHour) / MiliSecsInMinute,
    );
    const seconds = Math.floor(
      (miliSeconds - hours * MiliSecsInHour - minutes * MiliSecsInMinute) /
        MiliSecsInSecond,
    );
    if (hours) {
      return this.formatReqMessagesString('common.hoursAndMinutes', [
        hours,
        minutes,
      ]);
    } else if (minutes) {
      return this.formatReqMessagesString('common.minutesAndSeconds', [
        minutes,
        seconds,
      ]);
    } else {
      return this.formatReqMessagesString('common.onlySeconds', [
        seconds ? seconds : 1,
      ]);
    }
  }

  public classToClass<T>(cls: ClassConstructor<T>, plain: any) {
    const converted = plainToClass(cls, plain);
    for (const [key, value] of Object.entries(plain)) {
      if (value && !converted[key]) {
        converted[key] = plain[key];
      }
    }
    return converted;
  }

  public formatReqMessagesString(langTag: string, args?: any[]) {
    const str: any = this.i18n.t(langTag, {
      lang:
        I18nContext.current()?.lang &&
        this.i18n.getSupportedLanguages().includes(I18nContext.current()?.lang)
          ? I18nContext.current()?.lang
          : this.i18nOptions.fallbackLanguage,
      args: args,
    });
    return str;
  }

  private isQueryDto(obj) {
    if (
      obj &&
      typeof obj === 'object' &&
      (obj['filterAnd'] || obj['filterOr'])
    ) {
      return true;
    }
    return false;
  }

  private prepareValue(value: any, table?: string, toLower?: boolean) {
    if (value instanceof Array) {
      return '(' + value.map((e) => `'${e}'`).join(',') + ')';
    } else if (this.isQueryDto(value)) {
      return this.generateWhereSQL(value, undefined, table);
    } else if (typeof value === 'string') {
      if (value === 'NULL') {
        return value;
      }
      if (toLower != true) {
        return "'" + value + "'";
      } else {
        return "LOWER('" + value + "')";
      }
    }
    return value;
  }

  private prepareKey(col: string, table?: string) {
    let key;
    if (col.includes('->>')) {
      const parts = col.split('->>');
      key = `"${parts[0]}"->>'${parts[1]}'`;
    } else {
      key = `"${col}"`;
    }
    return `${table ? table + '.' : ''}${key}`;
  }

  private isLower(key: string) {
    if ([].includes(key)) return true;
  }

  public generateWhereSQL(
    query: QueryDto,
    extraSQL?: string,
    table?: string,
    ignoreCol?: string[],
  ) {
    let sql = '';
    if (query.filterAnd) {
      if (ignoreCol) {
        query.filterAnd = query.filterAnd.filter(
          (e) => ignoreCol.indexOf(e.key) >= 0,
        );
      }
      sql += query.filterAnd
        .map((e) => {
          if (this.isQueryDto(e.value)) {
            return `(${this.prepareValue(e.value, table)})`;
          } else if (e.action) {
            if (e.action.type === QueryActionEnum.CAST) {
              const type =
                e.action.dataType !== 'NUMERIC' ? 'DECIMAL' : e.action.dataType;
              return `CAST(${this.prepareKey(e.key, table)} AS ${type}) ${
                e.operation
              } ${this.prepareValue(e.value, table, true)}`;
            }
            return `(${this.prepareValue(e.value, table)})`;
          } else if (e.operation === 'ANY') {
            return `${this.prepareValue(
              e.value,
              table,
            )} = ANY(${this.prepareKey(e.key, table)})`;
          } else if (e.keyOperation) {
            return `${e.keyOperation}(${this.prepareKey(e.key, table)}) ${
              e.operation
            } ${this.prepareValue(e.value, table, true)}`;
          } else if (this.isLower(e.key) && typeof e.value === 'string') {
            return `LOWER(${this.prepareKey(e.key, table)}) ${
              e.operation
            } ${this.prepareValue(e.value, table, true)}`;
          } else {
            return `${this.prepareKey(e.key, table)} ${
              e.operation
            } ${this.prepareValue(e.value, table)}`;
          }
        })
        .join(' and ');
    }
    if (query.filterOr) {
      if (ignoreCol) {
        query.filterOr = query.filterOr.filter(
          (e) => ignoreCol.indexOf(e.key) >= 0,
        );
      }
      const orSQl = query.filterOr
        .map((e) => {
          if (this.isQueryDto(e.value)) {
            return `(${this.prepareValue(e.value, table)})`;
          } else if (e.operation === 'ANY') {
            return `${this.prepareValue(
              e.value,
              table,
            )} = ANY(${this.prepareKey(e.key, table)})`;
          } else if (e.keyOperation) {
            return `${e.keyOperation}(${this.prepareKey(e.key, table)}) ${
              e.operation
            } ${this.prepareValue(e.value, table, true)}`;
          } else if (this.isLower(e.key) && typeof e.value === 'string') {
            return `LOWER(${this.prepareKey(e.key, table)}) ${
              e.operation
            } ${this.prepareValue(e.value, table, true)}`;
          } else {
            return `${this.prepareKey(e.key, table)} ${
              e.operation
            } ${this.prepareValue(e.value, table)}`;
          }
        })
        .join(' or ');
      if (sql != '') {
        sql = `(${sql}) and (${orSQl})`;
      } else {
        sql = orSQl;
      }
    }

    if (sql != '') {
      if (extraSQL) {
        sql = `(${sql}) and (${extraSQL})`;
      }
    } else if (extraSQL) {
      sql = extraSQL;
    }
    return sql;
  }
}
