class PaymentDto {
  amount: string;

  currency: string;
}

class DebtorAccountDto {
  ispb?: string;

  issuer: string;

  number: string;

  accountType: string;
}

class CreditorAccountDto {
  ispb?: string;

  issuer: string;

  number: string;

  accountType: string;
}

export class CreatePaymentsV4Command {
  consentId: string;

  pixId: string = null;

  proxy: string;

  endToEndId: string;

  ibgeTownCode: string;

  status: string;

  date: string;

  localInstrument: string;

  cnpjInitiator: string;

  payment: PaymentDto;

  transactionIdentification?: string;

  remittanceInformation: string;

  authorisationFlow?: string;

  qrCode: string;

  debtorAccount: DebtorAccountDto;

  creditorAccount: CreditorAccountDto;
}
