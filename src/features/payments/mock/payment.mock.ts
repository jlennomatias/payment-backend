export const mockQrCodeResponse = {
  amount: 10.13,
  payeeAccount: {
    accountNumber: '1234567',
    bankCode: '99999004',
    payeeName: 'QRTester',
    mainRegistrationId: '11111111000191',
    branchCode: '0001',
    checkDigit: '8',
    accountType: 'CACC',
    key: '4004901d-bd85-4769-8e52-cb4c42c506dc'
  }
}
export const mockProxyResponse = {
    key: 'cliente-a00001@pix.bcb.gov.br'
}
export const mockDictResponse = {
  endToEndId: "E4065462220240709151164849497127",
  keyType: "CPF",
  bankAccount: {
    accountNumber: "1234567",
    accountType: "CACC",
    bankCode: "99999004",
    branchCode: "0001",
    checkDigit: "8",
  },
  owner: {
    type: "PESSOA_NATURAL",
    ownerName: "Joao Silva",
    mainRegistrationId: "99991111140",
  },
}

export const mockPixResponse = {
  "amount": 0.01,
  "endToEndId": "E1234567890123456789012345678901",
  "payeeName": "Trinus Bank",
  "payerName": "Nova Horizon Investimentos Imobiliários SPE LTDA",
  "status": "COMPLETED"
}

export const mockGetPixResponse = {
  status: 'COMPLETED',
  payer: {
    bankCode: '40654622',
    mainRegistrationId: '22712946000113',
    branchCode: '0001',
    checkDigit: '1',
    accountNumber: '5532'
  }
}

export const mockGetAccountResponse = [{
  mainRegistrationId: '22712946000113',
  holderName: "Nova Horizon Investimentos Imobiliários SPE LTDA",
  accountNumber: '5532',
  bankCode: '40654622',
  branchCode: '0001',
  checkDigit: '1',
  accountType: "CACC"
}]

