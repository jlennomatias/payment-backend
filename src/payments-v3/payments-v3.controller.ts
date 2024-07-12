import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsV3Service } from './payments-v3.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePaymentsV3Dto } from './dto/create-payments-v3.dto';

@Controller('payments/v3/')
export class PaymentsV3Controller {
  constructor(private readonly paymentsV3Service: PaymentsV3Service) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() CreatePaymentsV3: CreatePaymentsV3Dto) {
    return this.paymentsV3Service.create(CreatePaymentsV3);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsV3Service.findOne(id);
  }

  // @Patch(':id')
  // cancelOne(
  //   @Param('id') id: string,
  //   @Body() cancelPaymentsV3Dto: CancelPaymentsV3Dto,
  // ) {
  //   return this.paymentsV3Service.cancel(id, cancelPaymentsV3Dto);
  // }
}
