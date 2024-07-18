import { Controller, Get, Post, Body, Patch, Param, UseInterceptors, Query } from '@nestjs/common';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { AutomaticPaymentsV1Service } from './automatic-payments-v1.service';
import { CreateAutomaticPaymentsV1Dto } from './dto/create-automatic-payments-v1.dto';
import { ResponsePaymentDto, ResponsePaymentsDto } from '../dto/response-payment.swagger';
import { PaymentInterceptor } from '@core/interceptors/payment.interceptor';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseErrorPaymentsDto } from '../dto/response-error.dto';
import { CancelPaymentsDto } from '../dto/cancel-payments.dto';

@Controller('automatic-payments/v1')
export class AutomaticPaymentsV1Controller {
  constructor(private readonly automaticPaymentsV1Service: AutomaticPaymentsV1Service) {}

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
  create(@Body() createAutomaticPaymentsV1Dto: CreateAutomaticPaymentsV1Dto) {
    return this.automaticPaymentsV1Service.create(createAutomaticPaymentsV1Dto)
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
    return this.automaticPaymentsV1Service.findOne(paymentId)
  }

  @UseInterceptors(PaymentInterceptor)
  @Get()
  @ApiOperation({ summary: 'Listar um pagamento' })
  @ApiResponse({
    status: 200,
    description: 'pagamento retornado com sucesso',
    type: ResponsePaymentDto,
  })
  findAll(@Query('recurringConsentId') recurringConsentId: string) {
    return this.automaticPaymentsV1Service.findAll(recurringConsentId)
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
    return this.automaticPaymentsV1Service.cancel(paymentId, cancelPaymentsV4Dto)
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
    return this.automaticPaymentsV1Service.update(paymentId, updatePaymentsV4Dto)
  }
}
