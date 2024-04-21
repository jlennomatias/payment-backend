export class CreatePixDto {
  amount: number;
  clientCode: string;
  debitParty: {
    account: string;
    branch: number;
    taxId: string;
    accountType: string;
    name: string;
  };
  creditParty: {
    key: string;
    bank: string;
    account: string;
    branch: number;
    taxId: string;
    accountType: string;
    name: string;
  };
  endToEndId: string;
  initiationType: string;
  remittanceInformation: string;
  paymentType: string;
  urgency: string;
  transactionType: string;
}
