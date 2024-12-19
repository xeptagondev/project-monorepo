import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { DbModule } from '@app/db';

@Module({
  imports: [CoreModule, SharedModule, DbModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
