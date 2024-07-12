import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsV4Service } from './payments-v4.service';
import { CreatePaymentsV4Dto } from './dto/create-payments-v4.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { CancelPaymentsV4Dto } from './dto/cancel-payments-v4.dto';
// import { UpdatePaymentsV4Dto } from './dto/rejection-reason-payment-v4.dto';

@Controller('payments/v4/')
export class PaymentsV4Controller {
  constructor(private readonly paymentsV4Service: PaymentsV4Service) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPaymentsV4Dto: CreatePaymentsV4Dto) {
    return this.paymentsV4Service.create(createPaymentsV4Dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('consents/:id')
  findAll(@Param('id') id: string) {
    return this.paymentsV4Service.findAll(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsV4Service.findOne(id);
  }

  // @Patch(':id')
  // cancelOne(
  //   @Param('id') id: string,
  //   @Body() cancelPaymentsV4Dto: CancelPaymentsV4Dto,
  // ) {
  //   return this.paymentsV4Service.cancel(id, cancelPaymentsV4Dto);
  // }

  // @Patch('consents/:id')
  // cancelAll(
  //   @Param('id') id: string,
  //   @Body() cancelPaymentsV4Dto: CancelPaymentsV4Dto,
  // ) {
  //   return this.paymentsV4Service.cancelAll(id, cancelPaymentsV4Dto);
  // }

  // @Patch('/webhook/update-payment/:id')
  // updatePayment(
  //   @Param('id') id: string,
  //   @Body() updatePaymentsV4Dto: UpdatePaymentsV4Dto,
  // ) {
  //   return this.paymentsV4Service.update(id, updatePaymentsV4Dto);
  // }

  // @Patch('/webhook/update-status/:id')
  // updateStatus(
  //   @Param('id') id: string,
  //   @Body() updatePaymentsV4Dto: UpdatePaymentsV4Dto,
  // ) {
  //   return this.paymentsV4Service.update(id, updatePaymentsV4Dto);
  // }
}
