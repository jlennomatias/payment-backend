import { dataFormat } from '@util/library'
import { DefaultError } from '@core/exceptions/erros/erros'

const mapItemToDto = (item: any) => {
  return {
    paymentId: item.payment_id,
    consentId: item.consent_id,
    recurringPaymentId: item.recurring_payment_id,
    recurringConsentId: item.recurring_consent_id,
    // ...(item.qr_code && { qrCode: item.qr_code }),
    debtorAccount: {
      ispb: item.debtor_ispb,
      issuer: item.debtor_issuer,
      number: item.debtor_number,
      accountType: item.debtor_account_type,
    },
    creditorAccount: {
      ispb: item.creditor_ispb,
      issuer: item.creditor_issuer,
      number: item.creditor_number,
      accountType: item.creditor_account_type,
    },
    ...(item.recurring_payment_id && { date: item.date }),
    ...(item.recurring_payment_id && {
      document: {
        identification: item.debtor_document,
        rel: item.debtor_document.length > 11 ? 'CNPJ' : 'CPF',
      },
    }),
    endToEndId: item.end_to_end_id,
    creationDateTime: dataFormat(
      new Date(item.creation_date_time).toISOString(),
    ),
    statusUpdateDateTime: dataFormat(
      new Date(item.status_update_date_time).toISOString(),
    ),
    ...(item.proxy && { proxy: item.proxy }),
    ...(item.ibge_town_code && { ibgeTownCode: item.ibge_town_code }),
    status: item.status,
    ...(item.code && {
      rejectionReason: {
        code: item.code,
        detail: item.detail,
      },
    }),
    localInstrument: item.local_instrument,
    cnpjInitiator: item.cnpj_initiator,
    payment: {
      amount: item.payment_amount,
      currency: item.payment_currency,
    },
    ...(item.transaction_identification && {
      transactionIdentification: item.transaction_identification,
    }),
    remittanceInformation: item.remittance_information,
    ...(item.authorisation_ilow && {
      authorisationFlow: item.authorisation_flow,
    }),
    ...(item.rejection_code && {
      rejectionReason: {
        code: item.rejection_code,
        detail: item.rejection_detail,
      },
    }),
    ...(item.cancelled_from && {
      cancellation: {
        reason: item.cancelled_reason,
        cancelledFrom: item.cancelled_from,
        cancelledAt: dataFormat(new Date(item.cancelled_at).toISOString()),
        cancelledBy: {
          document: {
            identification: item.cancelled_by_identification,
            rel: item.cancelled_by_rel,
          },
        },
      },
    }),
  }
}

export const mapToPaymentResponseDto = (payment: any) => {
  let data: any

  if (Array.isArray(payment)) {
    data = payment.map(item => mapItemToDto(item))
  } else {
    data = mapItemToDto(payment)
  }

  return data
}

const mapAutomaticPaymentItemToDto = (item: any) => {
  return {
    recurringPaymentId: item.recurring_payment_id,
    recurringConsentId: item.recurring_consent_id,
    ...(item.qr_code && { qrCode: item.qr_code }),
    endToEndId: item.end_to_end_id,
    creationDateTime: dataFormat(
      new Date(item.creation_date_time).toISOString(),
    ),
    statusUpdateDateTime: dataFormat(
      new Date(item.status_update_date_time).toISOString(),
    ),
    proxy: item.proxy,
    date: item.date,
    status: item.status,
    payment: {
      amount: item.payment_amount,
      currency: item.payment_currency,
    },
    ...(item.transaction_identification && {
      transactionIdentification: item.transaction_identification,
    }),
    ...(item.recurring_payment_id && {
      document: {
        identification: item.debtor_document,
        rel: item.debtor_document.length > 11 ? 'CNPJ' : 'CPF',
      },
    }),
    remittanceInformation: item.remittance_information,
    ...(item.rejection_code && {
      rejectionReason: {
        code: item.rejection_code,
        detail: item.rejection_detail,
      },
    }),
    ...(item.cancelled_from && {
      cancellation: {
        reason: item.cancelled_reason,
        cancelledFrom: item.cancelled_from,
        cancelledAt: dataFormat(new Date(item.cancelled_at).toISOString()),
        cancelledBy: {
          document: {
            identification: item.cancelled_by_identification,
            rel: item.cancelled_by_rel,
          },
        },
      },
    }),
  }
}

export const mapToAutomaticPaymentResponseDto = (payment: any) => {
  let data: any

  if (Array.isArray(payment)) {
    data = payment.map(item => mapAutomaticPaymentItemToDto(item))
  } else {
    data = mapItemToDto(payment)
  }

  return data
}

export const mapToCancellationPaymentResponseDto = (payment: any) => {
  // Verificar se payment é uma lista/array de objetos
  return payment.map(item => ({
    paymentId: item.payment_id,
    statusUpdateDateTime: dataFormat(
      new Date(item.status_update_date_time).toISOString(),
    ),
  }))
}
export const mapToPaymentResponseError = (error: any) => {
  // Retornar a estrutura com o tipo esperado
  const errors = {
    code: error.code || 'DETALHE_PAGAMENTO_INVALIDO',
    title: error.title || 'Detalhe do pagamento invalido',
    detail: error.detail,
  }
  const meta = {
    requestDateTime: dataFormat(new Date().toISOString()),
  }
  throw new DefaultError([errors], meta)
}
