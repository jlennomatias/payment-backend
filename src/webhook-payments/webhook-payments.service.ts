import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebhookPaymentsService {
  private pixStatus: any = null; // Mantém o último valor recebido
  constructor(
    private httpService: HttpService,
    private prismaService: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS) // Executa a cada hora, por exemplo
  async fetchDataAndUpdate(pixId: string, paymentId: string, status: string) {
    console.log(
      `- Iniciando o WebhookPix com os valores pixId: ${pixId}, paymentId: ${paymentId}, status: ${status}`,
    );
    try {
      const newValue = await this.fetchData(pixId); // Obtém os dados atuais

      console.log(`- Validando status atual: ${newValue}`);
      console.log(
        `- Validando se houve alteração de status do pix. status: ${this.hasValueChanged(newValue)}`,
      );
      console.log(
        `- Validando se o status é um enum. status: ${this.isValidStatus(newValue)}`,
      );
      if (this.hasValueChanged(newValue) && this.isValidStatus(newValue)) {
        console.log(`- Atualizando o status do paymentId ${paymentId}`);
        await this.updateData(newValue, paymentId); // Atualiza a base de dados se o status não for "ACSC"
      }
      return;
    } catch (error) {
      console.error('Erro ao executar a rotina: ', error);
    }
  }

  async fetchData(id: string): Promise<any> {
    console.log('- Consultando o status do pix');
    // Lógica para fazer a requisição GET para obter os dados atuais
    const response = await lastValueFrom(
      this.httpService.get(`http://localhost:3030/pix/${id}`),
    );
    console.log(`-- Status do pix: ${response.data.status}`);

    return this.convertStatus(response.data.status);
  }

  async updateData(newValue: string, paymentId: string): Promise<void> {
    // Lógica para fazer a requisição PUT para atualizar os dados na base
    console.log(`-- Alterando o status para: ${newValue}`);
    await this.prismaService.payments.update({
      where: { paymentId: paymentId },
      data: {
        status: 'ACSC',
      },
    });
    console.log('-- Acionando a api de webhook na Finansystech');
    // Atualiza na finansystech

    // await lastValueFrom(
    //   this.httpService.post(`http://localhost:3030/pix/${paymentId}`, {
    //     data: {
    //       timestamp: '2021-05-21T08:30:00Z',
    //     },
    //   }),
    // );

    this.pixStatus = newValue; // Atualiza o último valor recebido

    console.log(`-- Finalizando o webhook com status ${this.pixStatus} `);
  }

  hasValueChanged(newValue: any): boolean {
    // Verifica se o novo valor é diferente do último valor recebido
    return JSON.stringify(newValue) !== JSON.stringify(this.pixStatus);
  }

  convertStatus(data: string): string {
    const statusMap: { [key: string]: string } = {
      CONFIRMED: 'ACSC',
      SCHEDULE: 'SCHD',
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
