import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecurringConsentsService } from './recurring-consents.service';
import { CreateRecurringConsentDto } from './dto/create-recurring-consent.dto';
import { UpdateRecurringConsentDto } from './dto/update-recurring-consent.dto';

@Controller('recurring-consents')
export class RecurringConsentsController {
  constructor(private readonly recurringConsentsService: RecurringConsentsService) {}

  @Post()
  create(@Body() createRecurringConsentDto: CreateRecurringConsentDto) {
    return this.recurringConsentsService.create(createRecurringConsentDto);
  }

  @Get()
  findAll() {
    return this.recurringConsentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recurringConsentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecurringConsentDto: UpdateRecurringConsentDto) {
    return this.recurringConsentsService.update(+id, updateRecurringConsentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recurringConsentsService.remove(+id);
  }
}
