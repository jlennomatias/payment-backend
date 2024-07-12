import { Logger, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ExternalApiService } from 'src/external-api/external-api.service';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePaymentsV3Command } from './commands/update-payment/update-payment.command';
import { plainToClass } from 'class-transformer';
import { convertStatusClient } from 'utils/utils';

@Injectable()
export class PaymentScheduler {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly externalApiService: ExternalApiService,
    private readonly commandBus: CommandBus,
    private readonly logger: Logger,
  ) {}

  startCheckingPayment(pixId: string, paymentId: string) {
    this.logger.log(
      `start the cron job with values pixId: ${pixId}, paymentId: ${paymentId}`,
    );
    const jobName = `check-payment-status-${paymentId}`;

    // Adiciona o job ao SchedulerRegistry
    const interval = setInterval(async () => {
      try {
        const response = await this.externalApiService.getPix(paymentId);

        const status = response?.data?.stJdPiPro;

        this.logger.log(`Current status for payment ${paymentId}: ${status}`);
        const convertStatus = convertStatusClient(status);

        if (convertStatus === 'ACSC' || convertStatus === 'CANC') {
          const command = plainToClass(UpdatePaymentsV3Command, {
            paymentId: paymentId,
            status: convertStatus,
          });
          const affectedRows = await this.commandBus.execute(command);

          this.logger.log(`affectedRows ${JSON.stringify(affectedRows)}`);

          this.logger.log(
            `Desired status reached for payment ${paymentId}, stopping checks.`,
          );
          clearInterval(interval);
          this.schedulerRegistry.deleteInterval(jobName);
        }
      } catch (error) {
        this.logger.log(`cron log - ${jobName} - ${error}`);
      }
    }, 2000); // Intervalo de 2 segundos

    this.schedulerRegistry.addInterval(jobName, interval);
  }
}
