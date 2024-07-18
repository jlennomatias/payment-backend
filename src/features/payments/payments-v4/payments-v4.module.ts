import { Logger, Module } from '@nestjs/common'
import { PaymentsV4Service } from './payments-v4.service'
import { PaymentsV4Controller } from './payments-v4.controller'
import { CqrsModule } from '@nestjs/cqrs'
import { PixModule } from 'src/pix/pix.module'
import { PixService } from 'src/pix/pix.service'
import { CommandHandlers } from 'src/payments-v4/commands'
import { QueryHandlers } from 'src/payments-v4/queries'

@Module({
  imports: [CqrsModule, PixModule,],
  controllers: [PaymentsV4Controller],
  providers: [
    PaymentsV4Service,
    Logger,
    PixService,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
})
export class PaymentsV4Module {}
