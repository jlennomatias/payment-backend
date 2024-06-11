import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class WebhookPaymentsService {
  private pixStatus: any = null; // Mantém o último valor recebido
  constructor(
    private httpService: HttpService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS) // Executa a cada hora, por exemplo
  async fetchDataAndUpdate(pixId: string, paymentId: string, status: string) {
    this.logger.info(
      `Iniciando o WebhookPix com os valores de pixId: ${pixId}, paymentId: ${paymentId}, status: ${status}`,
    );

    try {
      const newValue = await this.fetchData(pixId); // Obtém os dados atuais
      await this.updatePixId(pixId, paymentId); // Obtém os dados atuais

      this.logger.info(
        `Atualizando o paymentId ${paymentId} com status: ${this.hasValueChanged(newValue)}`,
      );

      await this.updateData(newValue, paymentId); // Atualiza a base de dados se o status não for "ACSC"

      this.logger.info(`Webhook encerrado com status: ${newValue}`);

      return `- Webhook encerrado com status: ${newValue}`;
    } catch (error) {
      this.logger.error(`Erro ao executar a rotina: ${error}`);
    }
  }

  async fetchData(id: string): Promise<any> {
    this.logger.info(`Consultando o status do pix`);

    // Lógica para fazer a requisição GET para obter os dados atuais do pix
    const response = await lastValueFrom(
      this.httpService.get(`http://localhost:3030/pix/${id}`),
    );

    this.logger.info(`Status do pix: ${response.data.status}`);

    return this.convertStatus(response.data.status);
  }

  async updateData(newValue: string, paymentId: string): Promise<void> {
    // Lógica para fazer a requisição PUT para atualizar os dados na base

    this.logger.info(`Alterando o status para: ${newValue}`);

    await this.prismaService.payment.update({
      where: { paymentId: paymentId },
      data: {
        status: newValue,
      },
    });

    this.logger.info(`Acionando a api de webhook na Finansystech`);

    // await lastValueFrom(
    //   this.httpService.post(`http://localhost:3030/pix/${paymentId}`, {
    //     data: {
    //       timestamp: '2021-05-21T08:30:00Z',
    //     },
    //   }),
    // );

    this.pixStatus = newValue; // Atualiza o último valor recebido

    this.logger.info(`Finalizando o webhook com status ${this.pixStatus}`);
  }

  async updatePixId(pixId: string, paymentId: string): Promise<void> {
    // Lógica para fazer a requisição PUT para atualizar os dados na base

    this.logger.info(`Alterando o pixId na base de dados`);
    await this.prismaService.payment.update({
      where: { paymentId: paymentId },
      data: {
        pixId: pixId.toString(),
      },
    });

    this.logger.info(`Finalizando o pixId na base de dados`);
  }

  hasValueChanged(newValue: any): boolean {
    // Verifica se o novo valor é diferente do último valor recebido
    return JSON.stringify(newValue) !== JSON.stringify(this.pixStatus);
  }

  convertStatus(data: string): string {
    const statusMap: { [key: string]: string } = {
      CONFIRMED: 'ACSC',
      PROCESSING: 'SCHD',
      REJECT: 'RJCT',
      // Adicione mais mapeamentos conforme necessário
    };

    return statusMap[data] || data; // Retorna o valor correspondente ou o próprio status se não for encontrado
  }

  isValidStatus(data: string): boolean {
    // Verifica se o status aciona o webhook

    const events = ['ACSC', 'PNDG', 'SCHD', 'CANC', 'RJCT'];

    if (events.includes(data)) {
      return true;
    }
    return false;
  }
}
