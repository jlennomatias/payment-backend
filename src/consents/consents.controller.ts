import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConsentsService } from './consents.service';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UpdateConsentDto } from './dto/update-consent.dto';

@Controller('consents')
export class ConsentsController {
  constructor(private readonly consentsService: ConsentsService) {}

  @Post('')
  create(@Body() createConsentDto: CreateConsentDto) {
    return this.consentsService.create(createConsentDto);
  }

  @Get('')
  findAll() {
    return this.consentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsentDto: UpdateConsentDto) {
    return this.consentsService.update(id, updateConsentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consentsService.remove(id);
  }
}
