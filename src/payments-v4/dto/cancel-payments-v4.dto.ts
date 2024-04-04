import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DocumentDto {
  @IsNotEmpty()
  @IsString()
  identification: string;

  @IsNotEmpty()
  @IsString()
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
}

export class CancelPaymentsV4Dto {
  @ValidateNested()
  @Type(() => DataDto)
  data: DataDto;
}
