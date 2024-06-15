import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: string;

  @IsNotEmpty()
  @IsString()
  currency: string;
}

class DebtorAccountDto {
  @IsOptional()
  @IsString()
  ispb?: string;

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

class CreditorAccountDto {
  @IsOptional()
  @IsString()
  ispb?: string;

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

export class CreatePaymentsV4CommandDto {
  @IsNotEmpty()
  @IsString()
  consentId: string;

  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @IsNotEmpty()
  @IsString()
  pixId: string = null; // Default value

  @IsNotEmpty()
  @IsString()
  proxy: string;

  @IsNotEmpty()
  @IsString()
  endToEndId: string;

  @IsNotEmpty()
  @IsString()
  ibgeTownCode: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  localInstrument: string;

  @IsNotEmpty()
  @IsString()
  cnpjInitiator: string;

  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @IsOptional()
  @IsString()
  transactionIdentification?: string;

  @IsNotEmpty()
  @IsString()
  remittanceInformation: string;

  @IsOptional()
  @IsString()
  authorisationFlow?: string;

  @IsNotEmpty()
  @IsString()
  qrCode: string;

  @ValidateNested()
  @Type(() => DebtorAccountDto)
  debtorAccount: DebtorAccountDto;

  @ValidateNested()
  @Type(() => CreditorAccountDto)
  creditorAccount: CreditorAccountDto;
}
