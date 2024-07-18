import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
} from '@nestjs/common'
import { PaymentsV4Service } from './payments-v4.service'
import { CreatePaymentsV4Dto } from './dto/create-payments-v4.dto'
import { ResponsePaymentDto, ResponsePaymentsDto } from '../dto/response-payment.swagger'
import { ResponseErrorPaymentsDto } from '../dto/response-error.dto'
import { CancelPaymentsDto } from '../dto/cancel-payments.dto'
import { UpdatePaymentDto } from '../dto/update-payment.dto'
import { PaymentInterceptor } from 'src/core/interceptors/payment.interceptor'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ResponseCancelPaymentsV4Dto } from './dto/response-cancel-payment-v4.dto'

@Controller('payments/v4')
@ApiTags('Payments-V4')
export class PaymentsV4Controller {
  constructor(private readonly paymentsV4Service: PaymentsV4Service) {}

  @UseInterceptors(PaymentInterceptor)
  @Post()
  @ApiOperation({ summary: 'Criar pagamentos' })
  @ApiResponse({
    status: 201,
    description: 'Lista de pagamentos retornada com sucesso',
    type: ResponsePaymentsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parametros invalidos',
    type: ResponseErrorPaymentsDto,
  })
  create(@Body() createPaymentsV4Dto: CreatePaymentsV4Dto) {
    return this.paymentsV4Service.create(createPaymentsV4Dto)
  }

  @UseInterceptors(PaymentInterceptor)
  @Get(':paymentId')
  @ApiOperation({ summary: 'Listar um pagamento' })
  @ApiResponse({
    status: 200,
    description: 'pagamento retornado com sucesso',
    type: ResponsePaymentDto,
  })
  findOne(@Param('paymentId') paymentId: string) {
    return this.paymentsV4Service.findOne(paymentId)
  }

  @UseInterceptors(PaymentInterceptor)
  @Patch(':paymentId')
  @ApiOperation({ summary: 'Cancelar um pagamento' })
  @ApiResponse({
    status: 200,
    description: 'pagamento cancelado com sucesso',
    type: ResponsePaymentDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parametros invalidos',
    type: ResponseErrorPaymentsDto,
  })
  cancelOne(
    @Param('paymentId') paymentId: string,
    @Body() cancelPaymentsV4Dto: CancelPaymentsDto,
  ) {
    return this.paymentsV4Service.cancel(paymentId, cancelPaymentsV4Dto)
  }

  @UseInterceptors(PaymentInterceptor)
  @Patch('consents/:consentId')
  @ApiOperation({ summary: 'Listar todos os pagamento por consentId' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagamentos cancelados com sucesso',
    type: ResponseCancelPaymentsV4Dto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parametros invalidos',
    type: ResponseErrorPaymentsDto,
  })
  cancelAll(
    @Param('consentId') consentId: string,
    @Body() cancelPaymentsV4Dto: CancelPaymentsDto,
  ) {
    return this.paymentsV4Service.cancelAll(consentId, cancelPaymentsV4Dto)
  }

  @UseInterceptors(PaymentInterceptor)
  @Patch('update-payment/:paymentId')
  @ApiOperation({ summary: 'Alterar status de um pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Status do pagamento alterado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Parametros invalidos',
    type: ResponseErrorPaymentsDto,
  })
  update(
    @Param('paymentId') paymentId: string,
    @Body() updatePaymentsV4Dto: UpdatePaymentDto,
  ) {
    return this.paymentsV4Service.update(paymentId, updatePaymentsV4Dto)
  }
}
