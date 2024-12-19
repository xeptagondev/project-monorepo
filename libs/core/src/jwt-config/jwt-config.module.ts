import { Module } from '@nestjs/common';
import { JwtConfigService } from './jwt-config.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth-guards/auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  providers: [JwtConfigService, AuthGuard, JwtService],
  exports: [JwtModule, AuthGuard],
})
export class JwtConfigModule {}
