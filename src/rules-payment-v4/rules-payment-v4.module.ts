import { Module } from '@nestjs/common';
import { RulesPaymentV4Service } from './rules-payment-v4.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PixModule } from 'src/pix/pix.module';

@Module({
  imports: [PrismaModule, PixModule],
  providers: [RulesPaymentV4Service],
  exports: [RulesPaymentV4Service],
})
export class RulesPaymentV4Module {}
