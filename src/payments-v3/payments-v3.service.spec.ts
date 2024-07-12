import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsV3Service } from './payments-v3.service';

describe('PaymentsV3Service', () => {
  let service: PaymentsV3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsV3Service],
    }).compile();

    service = module.get<PaymentsV3Service>(PaymentsV3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
