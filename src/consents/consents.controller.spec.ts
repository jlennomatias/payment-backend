import { Test, TestingModule } from '@nestjs/testing';
import { ConsentsController } from './consents.controller';
import { ConsentsService } from './consents.service';

describe('ConsentsController', () => {
  let controller: ConsentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsentsController],
      providers: [ConsentsService],
    }).compile();

    controller = module.get<ConsentsController>(ConsentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
