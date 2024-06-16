import { CancelPaymentHandler } from './cancel-payment/cancel-payment.handler';
import { CreatePaymentHandler } from './create-payment/create-payment.handler';
import { UpdatePaymentHandler } from './update-payment/update-payment.handler';

export const CommandHandlers = [
  CreatePaymentHandler,
  CancelPaymentHandler,
  UpdatePaymentHandler,
];
