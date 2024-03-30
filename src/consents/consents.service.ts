import { Injectable } from '@nestjs/common';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConsentResponseDto } from './dto/response-consent.dto';

@Injectable()
export class ConsentsService {
  constructor(private prismaService: PrismaService) {}

  async create(createConsentDto: CreateConsentDto) {
    const { consentId, cpf, cnpj, proxy, debtorAccount, creditorAccount } =
      createConsentDto.data;

    const consent = await this.prismaService.consents.create({
      data: {
        consentId,
        cpf,
        cnpj,
        proxy,
        ispbDebtor: debtorAccount.ispb,
        issuerDebtor: debtorAccount.issuer,
        numberDebtor: debtorAccount.number,
        accountTypeDebtor: debtorAccount.accountType,
        ispbCreditor: creditorAccount.ispb,
        issuerCreditor: creditorAccount.issuer,
        numberCreditor: creditorAccount.number,
        accountTypeCreditor: creditorAccount.accountType,
      },
    });
    return this.mapToConsentResponseDto(consent);
  }

  async findAll() {
    const consents = await this.prismaService.consents.findMany();
    return consents.map(this.mapToConsentResponseDto);
  }

  async findOne(id: string) {
    const consent = await this.prismaService.consents.findUnique({
      where: { consentId: id },
    });
    return this.mapToConsentResponseDto(consent);
  }

  async update(id: string, updateConsentDto: UpdateConsentDto) {
    const { data } = updateConsentDto;
    const consent = await this.prismaService.consents.update({
      where: { consentId: id },
      data: {
        ...data,
      },
    });
    return this.mapToConsentResponseDto(consent);
  }

  async remove(id: string) {
    const consent = this.prismaService.consents.delete({
      where: { consentId: id },
    });
    return this.mapToConsentResponseDto(consent);
  }

  private mapToConsentResponseDto(consent): ConsentResponseDto {
    return {
      data: {
        consentId: consent.consentId,
        cpf: consent.cpf,
        ...(consent.cnpj && { cnpj: consent.cnpj }), // Torna o cnpj opcional
        proxy: consent.proxy,
        debtorAccount: {
          ispb: consent.ispbDebtor,
          issuer: consent.issuerDebtor,
          number: consent.numberDebtor,
          accountType: consent.accountTypeDebtor,
        },
        creditorAccount: {
          ispb: consent.ispbCreditor,
          issuer: consent.issuerCreditor,
          number: consent.numberCreditor,
          accountType: consent.accountTypeCreditor,
        },
      },
    };
  }
}
