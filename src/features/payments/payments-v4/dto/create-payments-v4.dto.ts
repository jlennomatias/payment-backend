import {
    IsNotEmpty,
    IsString,
    IsOptional,
    ValidateNested,
    IsEnum,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LocalInstrumentType } from '../../enums/local-instrument.enum'
import { ValidateProxy } from 'src/core/decorators/proxy-validator.decorator'
import { ValidateTransactionIdentification } from 'src/core/decorators/transaction-identification.decorator'

class PaymentDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The amount of the payment' })
    amount: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The currency of the payment' })
    currency: string
}
class CreditorDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The personType of the creditor' })
    personType: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The cpfCnpj of the creditor' })
    cpfCnpj: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The name of the creditor' })
    name: string
}

class CreditorAccountDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The ISPB of the creditor account' })
    ispb: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The issuer of the creditor account' })
    issuer: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The account number of the creditor' })
    number: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The type of the creditor account' })
    accountType: string
}

class DebtorAccountDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The ISPB of the creditor account' })
    ispb: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The issuer of the creditor account' })
    issuer: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The account number of the creditor' })
    number: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The type of the creditor account' })
    accountType: string
}

class DataDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'End-to-end identifier' })
    endToEndId: string

    @IsNotEmpty()
    @IsString()
    @IsEnum(LocalInstrumentType)
    @ApiProperty({
        description: 'The local instrument used',
        enum: LocalInstrumentType,
    })
    localInstrument: string

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PaymentDto)
    @ApiProperty({ description: 'Payment details' })
    payment: PaymentDto

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreditorDto)
    @ApiProperty({ description: 'Payment details' })
    creditor: CreditorDto

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreditorAccountDto)
    @ApiPropertyOptional({ description: 'Details of the creditor account' })
    creditorAccount: CreditorAccountDto

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DebtorAccountDto)
    @ApiPropertyOptional({ description: 'Details of the creditor account' })
    debtorAccount: DebtorAccountDto

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'customer document' })
    debtorDocument: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Remittance information' })
    remittanceInformation: string

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ description: 'QR code information' })
    qrCode?: string

    @ValidateProxy({
        message: 'Invalid proxy value based on the localInstrument',
    })
    @ApiPropertyOptional({ description: 'Proxy details' })
    proxy?: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'CNPJ of the initiator' })
    cnpjInitiator: string

    @ValidateTransactionIdentification({
        message:
            'Invalid transactionIdentification value based on the localInstrument',
    })
    @ApiPropertyOptional({ description: 'Transaction identification' })
    transactionIdentification?: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'IBGE town code' })
    ibgeTownCode: string

    @ApiPropertyOptional({ description: 'Authorisation flow' })
    authorisationFlow?: string


    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Consent ID for the transaction' })
    consentId: string
}

export class CreatePaymentsV4Dto {
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => DataDto)
    @ApiProperty({
        type: [DataDto],
        description: 'Array of data objects containing payment details',
    })
    data: DataDto[]
}
