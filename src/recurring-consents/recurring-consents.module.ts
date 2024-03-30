import { Module } from '@nestjs/common';
import { RecurringConsentsService } from './recurring-consents.service';
import { RecurringConsentsController } from './recurring-consents.controller';

@Module({
  controllers: [RecurringConsentsController],
  providers: [RecurringConsentsService],
})
export class RecurringConsentsModule {}
