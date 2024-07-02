import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AccountPaymentsType,
  PersonType,
  localInstrument,
} from 'utils/enum_pix';
import { IsEnumType } from 'utils/validator_dto';

class PaymentDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^((\d{1,16}\.\d{2}))$/)
  @MaxLength(19)
  @MinLength(4)
  amount: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([A-Z]{3})$/)
  @MaxLength(3)
  currency: string;
}

class DetailsAccountDto {
  @IsNotEmpty()
  // @IsOptional()
  @IsString()
  @Matches(/^[0-9]{8}$/) // Exemplo de regex para telefone
  ispb: string;

  @IsOptional()
  @Matches(/^[0-9]{1,4}$/)
  @IsString()
  issuer: string;

  @IsNotEmpty()
  @IsString()
  @IsEnumType(PersonType)
  personType: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  @Matches(/^([A-Za-zÀ-ÖØ-öø-ÿ,.@:&*+_<>()!?/\\$%\d' -]+)$/)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{11}$|^\d{14}$/)
  cpfCnpj: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{1,20}$/)
  number: string;

  @IsNotEmpty()
  @IsString()
  @IsEnumType(AccountPaymentsType)
  accountType: string;
}

class DataDto {
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^([E])([0-9]{8})([0-9]{4})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(2[0-3]|[01][0-9])([0-5][0-9])([a-zA-Z0-9]{11})$/,
  ) // Exemplo de regex para telefone
  endToEndId: string;

  @IsNotEmpty()
  @IsString()
  @IsEnumType(localInstrument)
  localInstrument: string;

  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @ValidateNested()
  @Type(() => DetailsAccountDto)
  creditorAccount: DetailsAccountDto;

  @ValidateNested()
  @Type(() => DetailsAccountDto)
  debtorAccount: DetailsAccountDto;

  @IsNotEmpty()
  @IsString()
  @Matches(/[\w\W\s]*/)
  @MaxLength(140)
  remittanceInformation: string;

  @IsOptional()
  @IsString()
  @Matches(/[\w\W\s]*/)
  @MaxLength(512)
  qrCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(77)
  @Matches(/[\w\W\s]*/)
  proxy?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{14}$/)
  @MaxLength(14)
  cnpjInitiator: string;

  @Matches(/^[a-zA-Z0-9]{1,35}$/)
  @MaxLength(35)
  transactionIdentification?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{7}$/)
  ibgeTownCode: string;

  authorisationFlow?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^urn:[a-zA-Z0-9][a-zA-Z0-9\-]{0,31}:[a-zA-Z0-9()+,\-.:=@;$_!*'%\/?#]+$/,
  )
  @MaxLength(256)
  consentId: string;
}

export class CreatePaymentsV4Dto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DataDto)
  data: DataDto[];
}
