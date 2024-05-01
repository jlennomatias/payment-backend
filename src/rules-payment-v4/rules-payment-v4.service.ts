import { Injectable } from '@nestjs/common';
import { UnprocessableEntityError, NotFoundError } from 'src/erros';
import { CreatePaymentsV4Dto } from 'src/payments-v4/dto/create-payments-v4.dto';
import { PixService } from 'src/pix/pix.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RulesPaymentV4Service {
  constructor(
    private prismaService: PrismaService,
    private pixService: PixService,
  ) {}

  async rulesCreatePayments(
    createPaymentsV4Dto: CreatePaymentsV4Dto,
  ): Promise<boolean> {
    console.log('Iniciando as regras de negócios', createPaymentsV4Dto);
    try {
      await this.consentsAreEquals(createPaymentsV4Dto);

      // await this.pixService.getDict(consentId);
      return true;
    } catch (error) {
      console.error('Erro ao aplicar as regras de negócios:', error);
      throw error;
    }
  }

  async consentsAreEquals(
    createPaymentsV4Dto: CreatePaymentsV4Dto,
  ): Promise<boolean> {
    console.log('Verificando se os consentimentos são iguais');

    const consentId = createPaymentsV4Dto.data[0].consentId;
    const allConsentIdsAreEqual = createPaymentsV4Dto.data.every(
      (item) => item.consentId === consentId,
    );
    if (!allConsentIdsAreEqual) {
      throw new UnprocessableEntityError(`Consents are not equal`);
    }
    return true;
  }

  async consentsExist(consentId: string) {
    console.log('Verificando se o consentimento existe');

    const existingConsent = await this.prismaService.consents.findUnique({
      where: { consentId },
    });
    if (!existingConsent) {
      throw new NotFoundError(`Consent with ID ${consentId} not found`);
    }
    return existingConsent;
  }
}
