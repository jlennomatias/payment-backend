import { Module } from '@nestjs/common';
import { PixService } from './pix.service';
import { HttpModule } from '@nestjs/axios';
import { ExternalApiModule } from 'src/external-api/external-api.module';

@Module({
  imports: [HttpModule, ExternalApiModule],
  providers: [PixService],
  exports: [PixService],
})
export class PixModule {}
