import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PaymentDto {
  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  currency: string;
}

class CreditorAccountDto {
  @IsNotEmpty()
  @IsString()
  ispb: string;

  @IsNotEmpty()
  @IsString()
  issuer: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  accountType: string;
}

class DataDto {
  @IsNotEmpty()
  @IsString()
  endToEndId: string;

  @IsNotEmpty()
  @IsString()
  localInstrument: string;

  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreditorAccountDto)
  creditorAccount?: CreditorAccountDto;

  @IsNotEmpty()
  @IsString()
  remittanceInformation: string;

  @IsOptional()
  @IsString()
  qrCode?: string;

  @IsNotEmpty()
  @IsString()
  proxy: string;

  @IsNotEmpty()
  @IsString()
  cnpjInitiator: string;

  transactionIdentification?: string;

  @IsNotEmpty()
  @IsString()
  ibgeTownCode: string;

  authorisationFlow?: string;

  @IsNotEmpty()
  @IsString()
  consentId: string;
}

export class CreatePaymentsV4Dto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DataDto)
  data: DataDto[];
}
