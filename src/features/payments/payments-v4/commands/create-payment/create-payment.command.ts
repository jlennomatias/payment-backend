export class CreatePaymentsV4Command {
  consent_id: string
  proxy?: string
  end_to_end_id: string
  ibge_town_code: string
  status: string
  date: string
  local_instrument: string
  cnpj_initiator: string
  payment_amount: string
  payment_currency: string
  transaction_identification?: string
  remittance_information?: string
  authorisation_flow?: string
  qr_code?: string
  debtor_document: string
  debtor_ispb: string
  debtor_issuer: string
  debtor_number: string
  debtor_account_type: string
  creditor_document: string
  creditor_type: string
  creditor_name: string
  creditor_ispb: string
  creditor_issuer: string
  creditor_number: string
  creditor_account_type: string
}
