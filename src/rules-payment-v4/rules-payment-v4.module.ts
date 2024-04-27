import { Module } from '@nestjs/common';
import { RulesPaymentV4Service } from './rules-payment-v4.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RulesPaymentV4Service],
  exports: [RulesPaymentV4Service],
})
export class RulesPaymentV4Module {}
