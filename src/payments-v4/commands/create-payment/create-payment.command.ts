export class CreatePaymentsV4Command {
  consentId: string;
  pixId: string;
  proxy?: string;
  endToEndId: string;
  ibgeTownCode: string;
  status: string;
  date: string;
  localInstrument: string;
  cnpjInitiator: string;
  payment: {
    amount: string;
    currency: string;
  };
  transactionIdentification?: string;
  remittanceInformation?: string;
  authorisationFlow?: string;
  qrCode?: string;
  debtorAccount: {
    ispb: string;
    issuer: string;
    number: string;
    accountType: string;
  };
  creditorAccount: {
    ispb: string;
    issuer: string;
    number: string;
    accountType: string;
  };
}
