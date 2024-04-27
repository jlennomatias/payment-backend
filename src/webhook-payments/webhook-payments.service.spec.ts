import { Test, TestingModule } from '@nestjs/testing';
import { WebhookPaymentsService } from './webhook-payments.service';

describe('WebhookPaymentsService', () => {
  let service: WebhookPaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookPaymentsService],
    }).compile();

    service = module.get<WebhookPaymentsService>(WebhookPaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
