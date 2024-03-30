import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsV4Service } from './payments-v4.service';
import { CreatePaymentsV4Dto } from './dto/create-payments-v4.dto';
import { UpdatePaymentsV4Dto } from './dto/update-payments-v4.dto';

@Controller('payments-v4')
export class PaymentsV4Controller {
  constructor(private readonly paymentsV4Service: PaymentsV4Service) {}

  @Post()
  create(@Body() createPaymentsV4Dto: CreatePaymentsV4Dto) {
    return this.paymentsV4Service.create(createPaymentsV4Dto);
  }

  @Get()
  findAll() {
    return this.paymentsV4Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsV4Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentsV4Dto: UpdatePaymentsV4Dto) {
    return this.paymentsV4Service.update(+id, updatePaymentsV4Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsV4Service.remove(+id);
  }
}
