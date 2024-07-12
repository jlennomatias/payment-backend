import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentsV3Dto } from './create-payments-v3.dto';

export class UpdatePaymentsV3Dto extends PartialType(CreatePaymentsV3Dto) {}
