import { Injectable } from '@nestjs/common';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConsentResponseDto } from './dto/response-consent.dto';
import { UnprocessableEntityError, NotFoundError } from 'src/erros';

@Injectable()
export class ConsentsService {
  constructor(private prismaService: PrismaService) {}

  async create(createConsentDto: CreateConsentDto) {
    try {
      const { consentId, cpf, cnpj, debtorAccount, creditorAccount } =
        createConsentDto.data;

      const consent = await this.prismaService.consents.create({
        data: {
          consentId,
          cpf,
          cnpj,
          ispbDebtor: debtorAccount.ispb,
          issuerDebtor: debtorAccount.issuer,
          numberDebtor: debtorAccount.number,
          accountTypeDebtor: debtorAccount.accountType,
          ispbCreditor: creditorAccount?.ispb,
          issuerCreditor: creditorAccount?.issuer,
          numberCreditor: creditorAccount?.number,
          accountTypeCreditor: creditorAccount?.accountType,
        },
      });
      return this.mapToConsentResponseDto(consent);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityError(`The consent already exists.`);
      }
      throw error;
    }
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
    try {
      const { data } = updateConsentDto;
      const consent = await this.prismaService.consents.update({
        where: { consentId: id },
        data: {
          ...data,
        },
      });
      return this.mapToConsentResponseDto(consent);
    } catch (error) {
      console.log(error);
      // if (error.code === 'P2002') {
      //   throw new NotEqualError(`The consent already exists.`);
      // }
      // throw error;
    }
  }

  async remove(id: string) {
    try {
      const consent = await this.prismaService.consents.delete({
        where: { consentId: id },
      });

      return this.mapToConsentResponseDto(consent);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(`Consent with ID ${id} not found`);
      }
      throw error;
    }
  }

  private mapToConsentResponseDto(consent): ConsentResponseDto {
    return {
      data: {
        consentId: consent.consentId,
        cpf: consent.cpf,
        ...(consent.cnpj && { cnpj: consent.cnpj }), // Torna o cnpj opcional
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
