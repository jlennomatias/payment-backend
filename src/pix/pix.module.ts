import { Module } from '@nestjs/common';
import { PixService } from './pix.service';

import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [PixService],
  exports: [PixService],
})
export class PixModule {}
