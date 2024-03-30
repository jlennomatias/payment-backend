import { PartialType } from '@nestjs/mapped-types';
import { CreateRecurringConsentDto } from './create-recurring-consent.dto';

export class UpdateRecurringConsentDto extends PartialType(CreateRecurringConsentDto) {}
