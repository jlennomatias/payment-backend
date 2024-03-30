import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsV4Service } from './payments-v4.service';

describe('PaymentsV4Service', () => {
  let service: PaymentsV4Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsV4Service],
    }).compile();

    service = module.get<PaymentsV4Service>(PaymentsV4Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
