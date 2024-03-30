import { PartialType } from '@nestjs/mapped-types';
import { CreateAutomaticPaymentsV1Dto } from './create-automatic-payments-v1.dto';

export class UpdateAutomaticPaymentsV1Dto extends PartialType(CreateAutomaticPaymentsV1Dto) {}
