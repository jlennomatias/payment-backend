import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsV3Controller } from './payments-v3.controller';
import { PaymentsV3Service } from './payments-V3.service';

describe('PaymentsV3Controller', () => {
  let controller: PaymentsV3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsV3Controller],
      providers: [PaymentsV3Service],
    }).compile();

    controller = module.get<PaymentsV3Controller>(PaymentsV3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
