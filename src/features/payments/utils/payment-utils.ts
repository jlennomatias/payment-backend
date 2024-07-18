import { UnprocessableEntityError } from "@core/exceptions/erros/erros";
import { PaymentStatusType } from "@features/payments/enums/payment-status.enum";
import { PaymentRejectionReasonType } from "@features/payments/enums/paymentsRejectionReason.enum";
import { validateConsult } from "@util/library";

export const validateQrCode = (paymentData: any, qrCodeResponseData): any => {
    if (paymentData.payment.amount !== qrCodeResponseData.amount.toString()) {
        throw new UnprocessableEntityError(
            `VALOR_INVALIDO`,
            `Valor invalido`,
            `O valor enviado não é válido para o QR Code informado`,
        );
    }
    if (!validateConsult(paymentData.creditorAccount, qrCodeResponseData.payeeAccount)) {
        throw new UnprocessableEntityError(
            `DETALHE_PAGAMENTO_INVALIDO`,
            `Detalhe do pagamento invalido`,
            `CreditorAccounts are not equal`,
        );
    }
}

export const validateDict = (paymentData: any, dictResponseData): any => {
    if (!validateConsult(paymentData.creditorAccount, dictResponseData)) {
        throw new UnprocessableEntityError(
            `DETALHE_PAGAMENTO_INVALIDO`,
            `Detalhe do pagamento invalido`,
            `CreditorAccounts are not equal`,
        );
    }
}

export const validateCancelPaymentStatus = (paymentStatus: any): any => {

  if (paymentStatus === PaymentStatusType.PDNG) {
        return 'CANCELADO_PENDENCIA'
      } else if (paymentStatus === PaymentStatusType.SCHD) {
        return 'CANCELADO_AGENDAMENTO'
      } else if (paymentStatus === PaymentStatusType.PATC) {
        return 'CANCELADO_MULTIPLAS_ALCADAS'
      } else {
        throw new UnprocessableEntityError(
          PaymentRejectionReasonType.PAGAMENTO_NAO_PERMITE_CANCELAMENTO,
          `Pagamento não permite cancelamento`,
          `Pagamento possui o status diferente de SCHD/PDNG/PATC`,
        )
      }
}