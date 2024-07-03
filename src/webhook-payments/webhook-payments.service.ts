import { Logger, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExternalApiService } from 'src/external-api/external-api.service';

@Injectable()
export class WebhookPaymentsService {
  constructor(
    private readonly externalApiService: ExternalApiService,
    private prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async fetchDataAndUpdate(pixId: string, paymentId: string, status: string) {
    this.logger.log(
      `Iniciando o WebhookPix com os valores de pixId: ${pixId}, paymentId: ${paymentId}, status: ${status}`,
    );

    try {
      // Webhook, consulta a api de getPix

      // Compara se o status é diferente de Processing/Scheduled,

      // Se for igual, continua consultando

      return;
    } catch (error) {
      this.logger.error(`Erro ao executar a rotina: ${error}`);
    }
  }
}
