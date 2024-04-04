import { Module } from '@nestjs/common';
import { RecurringConsentsService } from './recurring-consents.service';
import { RecurringConsentsController } from './recurring-consents.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecurringConsentsController],
  providers: [RecurringConsentsService],
})
export class RecurringConsentsModule {}
