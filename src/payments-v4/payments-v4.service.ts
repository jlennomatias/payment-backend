import { Injectable } from '@nestjs/common';
import { CreatePaymentsV4Dto } from './dto/create-payments-v4.dto';
import { UpdatePaymentsV4Dto } from './dto/update-payments-v4.dto';

@Injectable()
export class PaymentsV4Service {
  create(createPaymentsV4Dto: CreatePaymentsV4Dto) {
    return 'This action adds a new paymentsV4';
  }

  findAll() {
    return `This action returns all paymentsV4`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentsV4`;
  }

  update(id: number, updatePaymentsV4Dto: UpdatePaymentsV4Dto) {
    return `This action updates a #${id} paymentsV4`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentsV4`;
  }
}
