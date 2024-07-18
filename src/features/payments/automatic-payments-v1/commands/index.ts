import { CreateAutomaticPaymentHandler } from './create-payment/create-payment.handler'
import { UpdateAutomaticPaymentHandler } from './update-payment/update-payment.handler'

export const CommandHandlers = [
  CreateAutomaticPaymentHandler,
  UpdateAutomaticPaymentHandler,
]
