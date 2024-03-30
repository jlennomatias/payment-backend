-- CreateTable
CREATE TABLE "consents" (
    "consentId" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cnpj" TEXT,
    "creationDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusUpdateDateTime" TIMESTAMP(3) NOT NULL,
    "proxy" TEXT NOT NULL,
    "ispbDebtor" TEXT NOT NULL,
    "issuerDebtor" TEXT NOT NULL,
    "numberDebtor" TEXT NOT NULL,
    "accountTypeDebtor" TEXT NOT NULL,
    "ispbCreditor" TEXT,
    "issuerCreditor" TEXT,
    "numberCreditor" TEXT,
    "accountTypeCreditor" TEXT,

    CONSTRAINT "consents_pkey" PRIMARY KEY ("consentId")
);

-- CreateTable
CREATE TABLE "payments" (
    "paymentId" TEXT NOT NULL,
    "consentsConsentId" TEXT NOT NULL,
    "endToEndId" TEXT NOT NULL,
    "creationDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusUpdateDateTime" TIMESTAMP(3) NOT NULL,
    "proxy" TEXT NOT NULL,
    "ibgeTownCode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "localInstrument" TEXT NOT NULL,
    "cnpjInitiator" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "transactionIdentification" TEXT NOT NULL,
    "remittanceInformation" TEXT NOT NULL,
    "authorisationFlow" TEXT NOT NULL,
    "qrCode" TEXT,
    "code" TEXT,
    "detail" TEXT,
    "reason" TEXT,
    "cancelledFrom" TEXT,
    "cancelledAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "cancelledByIdentification" TEXT,
    "cancelledByRel" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "recurringConsents" (
    "recurringConsentId" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cnpj" TEXT,
    "creationDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusUpdateDateTime" TIMESTAMP(3) NOT NULL,
    "proxy" TEXT NOT NULL,
    "ispbDebtor" TEXT NOT NULL,
    "issuerDebtor" TEXT NOT NULL,
    "numberDebtor" TEXT NOT NULL,
    "accountTypeDebtor" TEXT NOT NULL,
    "ispbCreditor" TEXT,
    "issuerCreditor" TEXT,
    "numberCreditor" TEXT,
    "accountTypeCreditor" TEXT,

    CONSTRAINT "recurringConsents_pkey" PRIMARY KEY ("recurringConsentId")
);

-- CreateTable
CREATE TABLE "automaticPayments" (
    "recurringPaymentId" TEXT NOT NULL,
    "consentsRecurringConsentId" TEXT NOT NULL,
    "endToEndId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "creationDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusUpdateDateTime" TIMESTAMP(3) NOT NULL,
    "proxy" TEXT NOT NULL,
    "ibgeTownCode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "cnpjInitiator" TEXT NOT NULL,
    "paymentAmount" TEXT NOT NULL,
    "paymentCurrency" TEXT NOT NULL,
    "transactionIdentification" TEXT NOT NULL,
    "remittanceInformation" TEXT NOT NULL,
    "authorisationFlow" TEXT NOT NULL,
    "qrCode" TEXT,
    "rejectionCode" TEXT,
    "rejectionDetail" TEXT,
    "cancellationReason" TEXT,
    "cancellationCancelledFrom" TEXT,
    "cancellationCancelledAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "cancellationCancelledByIdentification" TEXT,
    "cancellationCancelledByRel" TEXT,

    CONSTRAINT "automaticPayments_pkey" PRIMARY KEY ("recurringPaymentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_consentsConsentId_key" ON "payments"("consentsConsentId");

-- CreateIndex
CREATE UNIQUE INDEX "automaticPayments_consentsRecurringConsentId_key" ON "automaticPayments"("consentsRecurringConsentId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_consentsConsentId_fkey" FOREIGN KEY ("consentsConsentId") REFERENCES "consents"("consentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automaticPayments" ADD CONSTRAINT "automaticPayments_consentsRecurringConsentId_fkey" FOREIGN KEY ("consentsRecurringConsentId") REFERENCES "recurringConsents"("recurringConsentId") ON DELETE CASCADE ON UPDATE CASCADE;
