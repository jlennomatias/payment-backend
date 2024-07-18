import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsDate,
} from 'class-validator'

export class AutomaticPaymentCQRSDto {
  @ApiProperty({ description: 'Unique identifier for the payment' })
  @IsUUID()
  recurring_payment_id: string

  @ApiProperty({ description: 'Consent ID associated with the payment' })
  @IsNotEmpty()
  @IsString()
  recurring_consent_id: string

  @ApiPropertyOptional({ description: 'Pix ID, if applicable' })
  @IsOptional()
  @IsString()
  pix_id?: string

  @ApiProperty({ description: 'End-to-end identifier for the payment' })
  @IsNotEmpty()
  @IsString()
  end_to_end_id: string

  @ApiProperty({ description: 'Creation date and time of the payment' })
  @IsNotEmpty()
  @IsDate()
  creation_date_time: Date

  @ApiProperty({
    description: 'Date and time when the status was last updated',
  })
  @IsDateString()
  @IsDate()
  status_update_date_time: Date

  @ApiProperty({ description: 'Proxy information for the payment' })
  @IsNotEmpty()
  @IsString()
  proxy: string

  @ApiProperty({ description: 'IBGE code for the town' })
  @IsNotEmpty()
  @IsString()
  ibge_town_code: string

  @ApiProperty({ description: 'Status of the payment' })
  @IsNotEmpty()
  @IsString()
  status: string

  @ApiProperty({ description: 'Date of the payment' })
  @IsNotEmpty()
  @IsString()
  date: string

  @ApiProperty({ description: 'Local instrument used for the payment' })
  @IsNotEmpty()
  @IsString()
  local_instrument: string

  @ApiProperty({ description: 'CNPJ of the initiator of the payment' })
  @IsNotEmpty()
  @IsString()
  cnpj_initiator: string

  @ApiProperty({ description: 'Information about the remittance' })
  @IsNotEmpty()
  @IsString()
  remittance_information: string

  @ApiProperty({ description: 'Amount of the payment' })
  @IsNotEmpty()
  @IsString()
  payment_amount: string

  @ApiProperty({ description: 'Currency of the payment' })
  @IsNotEmpty()
  @IsString()
  payment_currency: string

  @ApiProperty({ description: 'ISPB of the debtor' })
  @IsNotEmpty()
  @IsString()
  debtor_document: string

  @ApiProperty({ description: 'ISPB of the debtor' })
  @IsNotEmpty()
  @IsString()
  debtor_ispb: string

  @ApiProperty({ description: 'Issuer of the debtor account' })
  @IsNotEmpty()
  @IsString()
  debtor_issuer: string

  @ApiProperty({ description: 'Number of the debtor account' })
  @IsNotEmpty()
  @IsString()
  debtor_number: string

  @ApiProperty({ description: 'Type of the debtor account' })
  @IsNotEmpty()
  @IsString()
  debtor_account_type: string

  @ApiProperty({ description: 'ISPB of the creditor' })
  @IsNotEmpty()
  @IsString()
  creditor_document: string

  @ApiProperty({ description: 'ISPB of the creditor' })
  @IsNotEmpty()
  @IsString()
  creditor_type: string

  @ApiProperty({ description: 'ISPB of the creditor' })
  @IsNotEmpty()
  @IsString()
  creditor_name: string

  @ApiProperty({ description: 'ISPB of the creditor' })
  @IsNotEmpty()
  @IsString()
  creditor_ispb: string

  @ApiProperty({ description: 'Issuer of the creditor account' })
  @IsNotEmpty()
  @IsString()
  creditor_issuer: string

  @ApiProperty({ description: 'Number of the creditor account' })
  @IsNotEmpty()
  @IsString()
  creditor_number: string

  @ApiProperty({ description: 'Type of the creditor account' })
  @IsNotEmpty()
  @IsString()
  creditor_account_type: string

  @ApiPropertyOptional({
    description: 'Transaction identification if applicable',
  })
  @IsOptional()
  @IsString()
  transaction_identification?: string

  @ApiPropertyOptional({ description: 'Authorisation flow for the payment' })
  @IsOptional()
  @IsString()
  authorisation_flow?: string

  @ApiPropertyOptional({ description: 'QR code for the payment if applicable' })
  @IsOptional()
  @IsString()
  qr_code?: string

  @ApiPropertyOptional({ description: 'Code related to the payment' })
  @IsOptional()
  @IsString()
  code?: string

  @ApiPropertyOptional({ description: 'Additional details about the payment' })
  @IsOptional()
  @IsString()
  detail?: string

  @ApiPropertyOptional({
    description: 'Reason for the payment or cancellation',
  })
  @IsOptional()
  @IsString()
  reason?: string

  @ApiPropertyOptional({
    description: 'Entity from which the payment was cancelled',
  })
  @IsOptional()
  @IsString()
  cancelled_from?: string

  @ApiPropertyOptional({
    description: 'Date and time when the payment was cancelled',
  })
  @IsOptional()
  @IsDateString()
  @IsDate()
  cancelled_at?: Date

  @ApiPropertyOptional({
    description: 'Identification of who cancelled the payment',
  })
  @IsOptional()
  @IsString()
  cancelled_by_identification?: string

  @ApiPropertyOptional({
    description: 'Relationship of who cancelled the payment',
  })
  @IsOptional()
  @IsString()
  cancelled_by_rel?: string
}
