import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ExternalApiService } from 'src/external-api/external-api.service';
import { Logger } from 'winston';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePaymentsV4Command } from './commands/update-payment/update-payment.command';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PaymentScheduler {
  private readonly desiredStatus = 'ACSC';

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly externalApiService: ExternalApiService,
    private readonly commandBus: CommandBus,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  startCheckingPayment(pixId: string, paymentId: string, status: string) {
    this.logger.info(
      `start the cron job with values pixId: ${pixId}, paymentId: ${paymentId}, status: ${status}`,
    );
    const jobName = `check-payment-status-${paymentId}`;

    // Adiciona o job ao SchedulerRegistry
    const interval = setInterval(async () => {
      // const status = await this.paymentService.checkPaymentStatus(paymentId);
      const response = await this.externalApiService.getPix(pixId);
      this.logger.info(
        `Current status for payment ${paymentId}: ${response.status}`,
      );
      const convertStatus = this.convertStatus(response.status);

      if (convertStatus === this.desiredStatus) {
        this.logger.info(
          `Desired status reached for payment ${paymentId}, stopping checks.`,
        );
        const command = plainToClass(UpdatePaymentsV4Command, {
          paymentId: paymentId,
          status: convertStatus,
        });
        const affectedRows = await this.commandBus.execute(command);

        this.logger.info(`affectedRows ${affectedRows}`);
        clearInterval(interval);
        this.schedulerRegistry.deleteInterval(jobName);
      }
    }, 10000); // Intervalo de 10 segundos

    this.schedulerRegistry.addInterval(jobName, interval);
  }

  convertStatus(data: string): string {
    const statusMap: { [key: string]: string } = {
      CONFIRMED: 'ACSC',
      PROCESSING: 'SCHD',
      REJECT: 'RJCT',
      // Adicione mais mapeamentos conforme necessário
    };
    return statusMap[data] || data;
  }
}
