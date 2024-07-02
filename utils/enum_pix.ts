export enum ErrorsTitlePayment {
  SALDO_INSUFICIENTE = 'Saldo insuficiente',
  VALOR_ACIMA_LIMITE = 'Valor acima do limite',
  VALOR_INVALIDO = 'Valor inválido',
  COBRANCA_INVALIDA = 'Cobrança inválido',
  CONSENTIMENTO_INVALIDO = 'Consentimento inválido',
  PARAMETRO_INVALIDO = 'Parâmetro inválido',
  NAO_INFORMADO = 'Não informado',
  PAGAMENTO_DIVERGENTE_CONSENTIMENTO = 'Pagamento divergente com consentimento',
  DETALHE_PAGAMENTO_INVALIDO = 'Detalhe de pagamento inválido',
  PAGAMENTO_RECUSADO_DETENTORA = 'Pagamento recusado pela detentora',
  PAGAMENTO_RECUSADO_SPI = 'Pagamento recusado pelo SPI',
  ERRO_IDEMPOTENCIA = 'Erro de identificação',
  CONSENTIMENTO_PENDENTE_AUTORIZACAO = 'Consentimento pendente de autorização',
}

export enum ErrorsCodePayment {
  SALDO_INSUFICIENTE = 'SALDO_INSUFICIENTE',
  VALOR_ACIMA_LIMITE = 'VALOR_ACIMA_LIMITE',
  VALOR_INVALIDO = 'VALOR_INVALIDO',
  COBRANCA_INVALIDA = 'COBRANCA_INVALIDA',
  CONSENTIMENTO_INVALIDO = 'CONSENTIMENTO_INVALIDO',
  PARAMETRO_INVALIDO = 'PARAMETRO_INVALIDO',
  NAO_INFORMADO = 'NAO_INFORMADO',
  PAGAMENTO_DIVERGENTE_CONSENTIMENTO = 'PAGAMENTO_DIVERGENTE_CONSENTIMENTO',
  DETALHE_PAGAMENTO_INVALIDO = 'DETALHE_PAGAMENTO_INVALIDO',
  PAGAMENTO_RECUSADO_DETENTORA = 'PAGAMENTO_RECUSADO_DETENTORA',
  PAGAMENTO_RECUSADO_SPI = 'PAGAMENTO_RECUSADO_SPI',
  ERRO_IDEMPOTENCIA = 'ERRO_IDEMPOTENCIA',
  CONSENTIMENTO_PENDENTE_AUTORIZACAO = 'CONSENTIMENTO_PENDENTE_AUTORIZACAO',
}

export enum localInstrument {
  MANU = 0,
  DICT = 1,
  QRES = 2,
  QRDN = 3,
  INIC = 6,
}

export enum PersonType {
  PESSOA_NATURAL = 0,
  PESSOA_JURIDICA = 1,
}

export enum PaymentPriorityType {
  PRIORITY = 0,
  ANALYSIS = 1,
  SCHEDULED = 2,
}

export enum PaymentStatusType {
  RCVD = 'RCVD',
  CANC = 'CANC',
  ACCP = 'ACCP',
  ACPD = 'ACPD',
  RJCT = 'RJCT',
  ACSC = 'ACSC',
  PDNG = 'PDNG',
  SCHD = 'SCHD',
}

export enum AccountPaymentsType {
  CACC = 0,
  SVGS = 2,
}

export enum AuthorisationStatusType {
  AWAITING_AUTHORISATION,
  AUTHORISED,
  REJECTED,
  CONSUMED,
  PARTIALLY_ACCEPTED,
}
