import { Test, TestingModule } from '@nestjs/testing';
import { AutomaticPaymentsV1Controller } from './automatic-payments-v1.controller';
import { AutomaticPaymentsV1Service } from './automatic-payments-v1.service';

describe('AutomaticPaymentsV1Controller', () => {
  let controller: AutomaticPaymentsV1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutomaticPaymentsV1Controller],
      providers: [AutomaticPaymentsV1Service],
    }).compile();

    controller = module.get<AutomaticPaymentsV1Controller>(AutomaticPaymentsV1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
