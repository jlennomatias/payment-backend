import { Test, TestingModule } from '@nestjs/testing';
import { RulesPaymentV4Service } from './rules-payment-v4.service';

describe('RulesPaymentV4Service', () => {
  let service: RulesPaymentV4Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RulesPaymentV4Service],
    }).compile();

    service = module.get<RulesPaymentV4Service>(RulesPaymentV4Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
