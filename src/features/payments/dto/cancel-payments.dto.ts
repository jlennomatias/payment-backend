import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  Matches,
  IsIn,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CancelledFromType } from '../enums/cancelled-from.enum'
import { PaymentRelType } from '../enums/payment-rel.enum'

class DocumentDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, { message: 'Identification must contain only numbers' })
  @ApiProperty({
    description: 'payment identification',
  })
  identification: string

  @IsNotEmpty()
  @IsString()
  @IsIn(['CPF', 'CNPJ'], { message: 'Rel must be either CPF or CNPJ' })
  @ApiProperty({
    description: 'payment rel',
    enum: PaymentRelType,
  })
  rel: string
}

class CancelledByDto {
  @ValidateNested()
  @Type(() => DocumentDto)
  @ApiProperty({
    description: 'payment document',
  })
  document: DocumentDto
}

class CancellationDto {
  @ValidateNested()
  @Type(() => CancelledByDto)
  @ApiProperty({
    description: 'payment cancelledBy',
  })
  cancelledBy: CancelledByDto
}

class DataCancellationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'payment status',
  })
  status: string

  @ApiProperty({
    description: 'cancelledFrom payment',
    enum: CancelledFromType,
  })
  cancelledFrom: string

  @ValidateNested()
  @Type(() => CancellationDto)
  @ApiProperty({
    description: 'cancellation payment',
  })
  cancellation: CancellationDto

  @ApiPropertyOptional({
    description: 'cancellation payment',
  })
  reasonCancel: string
}

export class CancelPaymentsDto {
  @ValidateNested()
  @Type(() => DataCancellationDto)
  @ApiProperty({
    type: [DataCancellationDto],
    description: 'Array of data objects containing payment details',
  })
  data: DataCancellationDto
}
