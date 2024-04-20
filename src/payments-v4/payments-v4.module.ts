import { Module } from '@nestjs/common';
import { PaymentsV4Service } from './payments-v4.service';
import { PaymentsV4Controller } from './payments-v4.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PixModule } from 'src/pix/pix.module';

@Module({
  imports: [PrismaModule, PixModule],
  controllers: [PaymentsV4Controller],
  providers: [PaymentsV4Service],
})
export class PaymentsV4Module {}
