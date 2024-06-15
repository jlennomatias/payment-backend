export class RejectionReason {
  code: string;
  detail: string;
}

export class Payment {
  amount: string;
  currency: string;
}

export class CreditorAccount {
  ispb: string;
  issuer: string;
  number: string;
  accountType: string;
}

export class DebitorAccount {
  ispb: string;
  issuer: string;
  number: string;
  accountType: string;
}

export class Cancellation {
  reason: string;
  cancelledFrom: string;
  cancelledAt: Date;
  cancelledByIdentification: string;
  cancelledByRel: string;
}

export class GetPaymentsV4Dto {
  paymentId: string;
  consentId: string;
  endToEndId: string;
  creationDateTime: Date;
  statusUpdateDateTime: Date;
  proxy: string;
  qrCode?: string;
  ibgeTownCode: string;
  status: string;
  date?: string;
  rejectionReason: RejectionReason;
  localInstrument: string;
  cnpjInitiator: string;
  payment: Payment;
  transactionIdentification?: string;
  remittanceInformation: string;
  creditorAccount: CreditorAccount;
  debtorAccount: DebitorAccount;
  authorisationFlow?: string;
  cancelation?: Cancellation;
}
