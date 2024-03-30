import { Module } from '@nestjs/common';
import { AutomaticPaymentsV1Service } from './automatic-payments-v1.service';
import { AutomaticPaymentsV1Controller } from './automatic-payments-v1.controller';

@Module({
  controllers: [AutomaticPaymentsV1Controller],
  providers: [AutomaticPaymentsV1Service],
})
export class AutomaticPaymentsV1Module {}
