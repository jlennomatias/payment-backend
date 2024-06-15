import { CancelPaymentHandler } from './cancel-payment/cancel-payment.handler';
import { CreatePaymentHandler } from './create-payment/create-payment.handler';

export const CommandHandlers = [CreatePaymentHandler, CancelPaymentHandler];
