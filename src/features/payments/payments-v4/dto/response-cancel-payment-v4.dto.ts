import { ApiProperty } from '@nestjs/swagger'

class DataDto {
  @ApiProperty({ description: 'Unique payment identifier' })
  paymentId: string

  @ApiProperty({ description: 'Status update date and time' })
  statusUpdateDateTime: string
}

class LinksDto {
  @ApiProperty({ description: 'Self link' })
  self: string
}

class MetaDto {
  @ApiProperty({ description: 'Request date and time' })
  requestDateTime: string
}

export class ResponseCancelPaymentsV4Dto {
  @ApiProperty({ type: [DataDto], description: 'Array of data objects' })
  data: DataDto[]

  @ApiProperty({ type: LinksDto, description: 'Links related to the response' })
  links: LinksDto

  @ApiProperty({ type: MetaDto, description: 'Metadata of the response' })
  meta: MetaDto
}
