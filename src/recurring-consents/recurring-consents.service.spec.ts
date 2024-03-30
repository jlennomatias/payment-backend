import { Test, TestingModule } from '@nestjs/testing';
import { RecurringConsentsService } from './recurring-consents.service';

describe('RecurringConsentsService', () => {
  let service: RecurringConsentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecurringConsentsService],
    }).compile();

    service = module.get<RecurringConsentsService>(RecurringConsentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
