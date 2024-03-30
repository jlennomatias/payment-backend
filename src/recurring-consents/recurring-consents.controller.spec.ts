import { Test, TestingModule } from '@nestjs/testing';
import { RecurringConsentsController } from './recurring-consents.controller';
import { RecurringConsentsService } from './recurring-consents.service';

describe('RecurringConsentsController', () => {
  let controller: RecurringConsentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecurringConsentsController],
      providers: [RecurringConsentsService],
    }).compile();

    controller = module.get<RecurringConsentsController>(RecurringConsentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
