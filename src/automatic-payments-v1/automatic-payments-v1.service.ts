import { Injectable } from '@nestjs/common';
import { CreateAutomaticPaymentsV1Dto } from './dto/create-automatic-payments-v1.dto';
import { UpdateAutomaticPaymentsV1Dto } from './dto/update-automatic-payments-v1.dto';

@Injectable()
export class AutomaticPaymentsV1Service {
  create(createAutomaticPaymentsV1Dto: CreateAutomaticPaymentsV1Dto) {
    return 'This action adds a new automaticPaymentsV1';
  }

  findAll() {
    return `This action returns all automaticPaymentsV1`;
  }

  findOne(id: number) {
    return `This action returns a #${id} automaticPaymentsV1`;
  }

  update(id: number, updateAutomaticPaymentsV1Dto: UpdateAutomaticPaymentsV1Dto) {
    return `This action updates a #${id} automaticPaymentsV1`;
  }

  remove(id: number) {
    return `This action removes a #${id} automaticPaymentsV1`;
  }
}
