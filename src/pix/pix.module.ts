import { Logger, Module } from '@nestjs/common';
import { PixService } from './pix.service';
import { ExternalApiModule } from 'src/external-api/external-api.module';

@Module({
  imports: [ExternalApiModule],
  providers: [PixService, Logger],
  exports: [PixService],
})
export class PixModule {}
