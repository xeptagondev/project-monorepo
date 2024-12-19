import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { AppConfigModule } from './app-config/app-config.module';
import { JwtConfigModule } from './jwt-config/jwt-config.module';

@Module({
  imports: [AppConfigModule, JwtConfigModule],
  providers: [CoreService],
  exports: [CoreService, AppConfigModule, JwtConfigModule],
})
export class CoreModule {}
