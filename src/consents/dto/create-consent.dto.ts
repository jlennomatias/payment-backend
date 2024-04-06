export class CreateConsentDto {
  data: {
    consentId: string;
    cpf: string;
    cnpj?: string;
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
  };
}
