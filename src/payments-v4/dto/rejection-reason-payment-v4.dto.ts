import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RejectionReasonDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  detail: string;
}
export class RejectionReasonPaymentV4Dto {
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @ValidateNested()
  @Type(() => RejectionReasonDto)
  rejectionReason: RejectionReasonDto;
}
