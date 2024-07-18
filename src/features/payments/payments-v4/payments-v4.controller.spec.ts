import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsV4Controller } from './payments-v4.controller';
import { PaymentsV4Service } from './payments-v4.service';

describe('PaymentsV4Controller', () => {
  let controller: PaymentsV4Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsV4Controller],
      providers: [PaymentsV4Service],
    }).compile();

    controller = module.get<PaymentsV4Controller>(PaymentsV4Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
