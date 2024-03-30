import { Test, TestingModule } from '@nestjs/testing';
import { AutomaticPaymentsV1Service } from './automatic-payments-v1.service';

describe('AutomaticPaymentsV1Service', () => {
  let service: AutomaticPaymentsV1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutomaticPaymentsV1Service],
    }).compile();

    service = module.get<AutomaticPaymentsV1Service>(AutomaticPaymentsV1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
