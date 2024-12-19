import { Module } from '@nestjs/common';
import { UtilityController } from './utility.controller';
import { UtilityService } from './utility.service';
import { SharedModule } from '@app/shared';
import { CoreModule } from '@app/core';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '@app/shared/entities/users.entity';

@Module({
  imports: [CoreModule, SharedModule, TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UtilityController],
  providers: [UtilityService],
})
export class UtilityModule {
  constructor(private readonly connection: DataSource) {
    this.connection.runMigrations();
  }
}
