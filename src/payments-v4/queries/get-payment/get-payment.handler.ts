import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPaymentQuery } from './get-payment.query';
import { GetPaymentsV4Dto } from 'src/payments-v4/dto/get-payment-v4.dto';

@QueryHandler(GetPaymentQuery)
export class GetPaymentHandler
  implements IQueryHandler<GetPaymentQuery, GetPaymentsV4Dto>
{
  constructor(private prismaService: PrismaService) {}

  async execute(query: GetPaymentQuery): Promise<any | null> {
    console.log(query);
    const include = {
      payment: {
        select: {
          amount: true,
          currency: true,
        },
      },
      debtorAccount: {
        select: {
          ispb: true,
          issuer: true,
          number: true,
          accountType: true,
        },
      },
      creditorAccount: {
        select: {
          ispb: true,
          issuer: true,
          number: true,
          accountType: true,
        },
      },
      cancellation: {
        select: {
          reason: true,
          cancelledFrom: true,
          cancelledAt: true,
          cancelledByIdentification: true,
          cancelledByRel: true,
        },
      },
    };

    let payments;

    if (query.consentId) {
      payments = await this.prismaService.payment.findMany({
        where: query,
        include: include,
      });

      if (!payments.length) return null;
    } else if (query.paymentId) {
      payments = await this.prismaService.payment.findUniqueOrThrow({
        where: { paymentId: query.paymentId },
        include: include,
      });

      if (!payments) return null;
    }

    return payments;
  }
}
