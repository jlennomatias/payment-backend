import { Module } from '@nestjs/common';
import { PaymentsV4Service } from './payments-v4.service';
import { PaymentsV4Controller } from './payments-v4.controller';

@Module({
  controllers: [PaymentsV4Controller],
  providers: [PaymentsV4Service],
})
export class PaymentsV4Module {}
