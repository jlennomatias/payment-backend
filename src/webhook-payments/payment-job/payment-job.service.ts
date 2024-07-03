import { Processor } from '@nestjs/bull';

@Processor('updatePayment')
export class PaymentJobService {}
