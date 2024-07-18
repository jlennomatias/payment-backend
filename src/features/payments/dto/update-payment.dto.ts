import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class UpdatePaymentDto {

  @IsOptional()
  @ApiPropertyOptional({ description: 'Trata-se de um identificador de transação que deve ser retransmitido intacto pelo PSP do pagador ao gerar a ordem de pagamento.' })
  transactionIdentification?: string

  @IsOptional()
  @ApiPropertyOptional({ description: 'Estado atual do pagamento.' })
  status?: string

  @IsOptional()
  @ApiPropertyOptional({ description: 'Código identificador do motivo de rejeição.' })
  rejection_code?: string

  @IsOptional()
  @ApiPropertyOptional({ description: 'Detalhe sobre o código identificador do motivo de rejeição.' })
  rejection_detail?: string
}
