import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentsV4Dto } from './create-payments-v4.dto';

export class UpdatePaymentsV4Dto extends PartialType(CreatePaymentsV4Dto) {}
