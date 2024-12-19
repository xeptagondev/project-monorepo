import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypeormDbConfigModule } from './db-config/typeorm-config/typeorm.db.config.module';
import { DbUtilModule } from './db-util/db-util.module';

@Module({
  imports: [
    process.env.DB_CONFIG == 'typeorm' //select which db configuration to use
      ? TypeormDbConfigModule
      : TypeormDbConfigModule,
    DbUtilModule,
  ],
  providers: [DbService],
  exports: [DbService, TypeormDbConfigModule],
})
export class DbModule {}
