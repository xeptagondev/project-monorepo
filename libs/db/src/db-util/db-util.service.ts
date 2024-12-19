import { QueryDto } from '@app/shared/dtos/query.dto';
import { QueryActionEnum } from '@app/shared/enums/query.action.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbUtilService {
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
