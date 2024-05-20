import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  Matches,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

class DocumentDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, { message: 'Identification must contain only numbers' })
  identification: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['CPF', 'CNPJ'], { message: 'Rel must be either CPF or CNPJ' })
  rel: string;
}

class CancelledByDto {
  @ValidateNested()
  @Type(() => DocumentDto)
  document: DocumentDto;
}

class CancellationDto {
  @ValidateNested()
  @Type(() => CancelledByDto)
  cancelledBy: CancelledByDto;
}

class DataDto {
  @IsNotEmpty()
  @IsString()
  status: string;

  @ValidateNested()
  @Type(() => CancellationDto)
  cancellation: CancellationDto;

  cancelledFrom: string;
}

export class CancelPaymentsV4Dto {
  @ValidateNested()
  @Type(() => DataDto)
  data: DataDto;
}
