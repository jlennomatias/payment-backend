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
