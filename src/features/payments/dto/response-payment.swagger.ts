import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CancelledFromType } from '../enums/cancelled-from.enum'
import { PaymentRelType } from '../enums/payment-rel.enum'
import { PaymentStatusType } from '../enums/payment-status.enum'

class RejectionReasonDto {
  @ApiProperty({ description: 'Rejection code' })
  code: string

  @ApiProperty({ description: 'Detailed rejection reason' })
  detail: string
}

class Document {
  @ApiProperty({ description: 'Detailed payment identification' })
  identification: string

  @ApiProperty({ description: 'Detailed payment rel' })
  rel: PaymentRelType
}

class CancellationDto {
  @ApiProperty({ description: 'Rejection code' })
  reason: PaymentStatusType

  @ApiProperty({
    description: 'Detailed cancelled from',
    enum: CancelledFromType,
  })
  cancelledFrom: string

  @ApiProperty({ description: 'Detailed cancelled at' })
  cancelledAt: string

  @ApiProperty({ description: 'Detailed cancelled by' })
  cancelledBy: Document
}

class PaymentDto {
  @ApiProperty({ description: 'Payment amount' })
  amount: string

  @ApiProperty({ description: 'Currency of the payment' })
  currency: string
}

class CreditorAccountDto {
  @ApiProperty({ description: 'ISPB of the creditor account' })
  ispb: string

  @ApiProperty({ description: 'Issuer of the creditor account' })
  issuer: string

  @ApiProperty({ description: 'Number of the creditor account' })
  number: string

  @ApiProperty({ description: 'Type of the creditor account' })
  accountType: string
}

class DebtorAccountDto {
  @ApiProperty({ description: 'ISPB of the debtor account' })
  ispb: string

  @ApiProperty({ description: 'Issuer of the debtor account' })
  issuer: string

  @ApiProperty({ description: 'Number of the debtor account' })
  number: string

  @ApiProperty({ description: 'Type of the debtor account' })
  accountType: string
}

class DataDto {
  @ApiProperty({ description: 'Unique payment identifier' })
  paymentId: string

  @ApiProperty({ description: 'Consent ID' })
  consentId: string

  @ApiProperty({ description: 'End-to-end ID' })
  endToEndId: string

  @ApiProperty({ description: 'Creation date and time' })
  creationDateTime: string

  @ApiProperty({ description: 'Status update date and time' })
  statusUpdateDateTime: string

  @ApiPropertyOptional({ description: 'Proxy details' })
  proxy?: string

  @ApiPropertyOptional({ description: 'QR code details' })
  qrCode?: string

  @ApiProperty({ description: 'IBGE town code' })
  ibgeTownCode: string

  @ApiProperty({ description: 'Payment status' })
  status: string

  @ApiPropertyOptional({ description: 'Reason for rejection' })
  rejectionReason?: RejectionReasonDto

  @ApiPropertyOptional({ description: 'Cancellation for cancelation' })
  cancellation?: CancellationDto

  @ApiProperty({ description: 'Local instrument' })
  localInstrument: string

  @ApiProperty({ description: 'CNPJ of the initiator' })
  cnpjInitiator: string

  @ApiProperty({ type: PaymentDto, description: 'Payment details' })
  payment: PaymentDto

  @ApiPropertyOptional({ description: 'Transaction identification' })
  transactionIdentification?: string

  @ApiProperty({ description: 'Remittance information' })
  remittanceInformation: string

  @ApiProperty({
    type: CreditorAccountDto,
    description: 'Creditor account details',
  })
  creditorAccount: CreditorAccountDto

  @ApiProperty({
    type: DebtorAccountDto,
    description: 'Debtor account details',
  })
  debtorAccount: DebtorAccountDto

  @ApiPropertyOptional({ description: 'Authorisation flow' })
  authorisationFlow?: string
}

class LinksDto {
  @ApiProperty({ description: 'Self link' })
  self: string
}

class MetaDto {
  @ApiProperty({ description: 'Request date and time' })
  requestDateTime: string
}

export class ResponsePaymentsDto {
  @ApiProperty({ type: [DataDto], description: 'Array of data objects' })
  data: DataDto[]

  @ApiProperty({ type: LinksDto, description: 'Links related to the response' })
  links: LinksDto

  @ApiProperty({ type: MetaDto, description: 'Metadata of the response' })
  meta: MetaDto
}

export class ResponsePaymentDto {
  @ApiProperty({ type: DataDto, description: 'Array of data objects' })
  data: DataDto

  @ApiProperty({ type: LinksDto, description: 'Links related to the response' })
  links: LinksDto

  @ApiProperty({ type: MetaDto, description: 'Metadata of the response' })
  meta: MetaDto
}
