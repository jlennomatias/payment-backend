export enum PaymentProcessJdPi {
  ERROR = -1,
  ACCEPTED = 0,
  EFFECTIVE = 9,
}

export enum PaymentDetailProcess {
  EFFECTIVE = 0,
  ERROR_PROCESS = 1,
  ERROR_JDPI = 2,
  TESTE = 5,
  ERROR_SPI,
  AWAIT_SPI = 8,
  AWAIT_JDPI = 9,
}

export enum PaymentTypeJ17 {
  TRANSFER = 'transfer',
  WITHDRAWAL = 'withdrawal',
  CHANGE = 'change',
}
