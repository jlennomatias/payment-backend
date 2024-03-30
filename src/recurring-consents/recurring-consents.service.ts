import { Injectable } from '@nestjs/common';
import { CreateRecurringConsentDto } from './dto/create-recurring-consent.dto';
import { UpdateRecurringConsentDto } from './dto/update-recurring-consent.dto';

@Injectable()
export class RecurringConsentsService {
  create(createRecurringConsentDto: CreateRecurringConsentDto) {
    return 'This action adds a new recurringConsent';
  }

  findAll() {
    return `This action returns all recurringConsents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recurringConsent`;
  }

  update(id: number, updateRecurringConsentDto: UpdateRecurringConsentDto) {
    return `This action updates a #${id} recurringConsent`;
  }

  remove(id: number) {
    return `This action removes a #${id} recurringConsent`;
  }
}
