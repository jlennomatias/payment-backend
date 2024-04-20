import { Module } from '@nestjs/common';
import { PixService } from './pix.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PixService],
  exports: [PixService],
})
export class PixModule {}
