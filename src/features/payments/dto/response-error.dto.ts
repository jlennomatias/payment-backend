import { ApiProperty } from '@nestjs/swagger'

export class Error {
  @ApiProperty({ description: 'Error code' })
  code: string
  @ApiProperty({ description: 'Error title' })
  title: string
  @ApiProperty({ description: 'Error description' })
  detail: string
}

export class Meta {
  @ApiProperty({ description: 'date and time of request' })
  requestDateTime: string
}

export class ResponseErrorPaymentsDto {
  @ApiProperty({ type: [Error], description: 'Errors' })
  errors: Error[]

  @ApiProperty({ description: 'Meta informations' })
  meta: Meta
}
