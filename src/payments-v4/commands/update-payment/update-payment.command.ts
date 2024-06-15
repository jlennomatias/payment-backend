export class UpdatePaymentsV4Command {
  paymentId: string;
  pixId: string;
  status: string;
  date: string;
  transactionIdentification?: string;
  remittanceInformation?: string;
}
