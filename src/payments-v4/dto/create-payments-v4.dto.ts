import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class SingleScheduleDto {
  @IsNotEmpty()
  @IsString()
  date: string;
}

class DailyScheduleDto {
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  quantity: number;
}

class WeeklyScheduleDto {
  @IsNotEmpty()
  @IsString()
  dayOfWeek: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  quantity: number;
}

class MonthlyScheduleDto {
  @IsNotEmpty()
  dayOfMonth: number;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  quantity: number;
}

class CustomScheduleDto {
  @IsNotEmpty()
  dates: string[];

  @IsNotEmpty()
  @IsString()
  additionalInformation: string;
}

type ScheduleDto =
  | SingleScheduleDto
  | DailyScheduleDto
  | WeeklyScheduleDto
  | MonthlyScheduleDto
  | CustomScheduleDto;

class PaymentDto {
  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsObject()
  @ValidateNested()
  schedule: ScheduleDto;
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
