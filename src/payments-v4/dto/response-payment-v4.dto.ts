export class ResponsePaymentsV4Dto {
  data: [
    {
      paymentId: string;
      consentId: string;
      endToEndId: string;
      creationDateTime: string;
      statusUpdateDateTime: string;
      proxy: string;
      qrCode?: string;
      ibgeTownCode: string;
      status: string;
      rejectionReason: {
        code: string;
        detail: string;
      };
      localInstrument: string;
      cnpjInitiator: string;
      payment: {
        amount: string;
        currency: string;
      };
      transactionIdentification: string;
      remittanceInformation: string;
      creditorAccount?: {
        ispb: string;
        issuer: string;
        number: string;
        accountType: string;
      };
      debtorAccount: {
        ispb: string;
        issuer: string;
        number: string;
        accountType: string;
      };
      authorisationFlow: string;
    },
  ];
  links: {
    self: string;
  };
  meta: {
    requestDateTime: string;
  };
}
