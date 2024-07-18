import { Logger, Module } from '@nestjs/common'
import { AutomaticPaymentsV1Service } from './automatic-payments-v1.service'
import { AutomaticPaymentsV1Controller } from './automatic-payments-v1.controller'
import { CqrsModule } from '@nestjs/cqrs'
import { QueryHandlers } from './queries'
import { CommandHandlers } from './commands'
import { PixService } from 'src/pix/pix.service'

@Module({
  imports: [CqrsModule,],
  controllers: [AutomaticPaymentsV1Controller],
  providers: [
    AutomaticPaymentsV1Service,
    Logger,
    PixService,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
})
export class AutomaticPaymentsV1Module {}
