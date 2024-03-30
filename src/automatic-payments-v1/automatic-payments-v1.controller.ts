import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AutomaticPaymentsV1Service } from './automatic-payments-v1.service';
import { CreateAutomaticPaymentsV1Dto } from './dto/create-automatic-payments-v1.dto';
import { UpdateAutomaticPaymentsV1Dto } from './dto/update-automatic-payments-v1.dto';

@Controller('automatic-payments-v1')
export class AutomaticPaymentsV1Controller {
  constructor(private readonly automaticPaymentsV1Service: AutomaticPaymentsV1Service) {}

  @Post()
  create(@Body() createAutomaticPaymentsV1Dto: CreateAutomaticPaymentsV1Dto) {
    return this.automaticPaymentsV1Service.create(createAutomaticPaymentsV1Dto);
  }

  @Get()
  findAll() {
    return this.automaticPaymentsV1Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.automaticPaymentsV1Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAutomaticPaymentsV1Dto: UpdateAutomaticPaymentsV1Dto) {
    return this.automaticPaymentsV1Service.update(+id, updateAutomaticPaymentsV1Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.automaticPaymentsV1Service.remove(+id);
  }
}
