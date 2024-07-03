-- CreateTable
CREATE TABLE "payment" (
    "_id" TEXT NOT NULL,
    "consentId" TEXT NOT NULL,
    "pixId" TEXT,
    "endToEndId" TEXT NOT NULL,
    "creationDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusUpdateDateTime" TIMESTAMP(3) NOT NULL,
    "proxy" TEXT NOT NULL,
    "ibgeTownCode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "localInstrument" TEXT NOT NULL,
    "cnpjInitiator" TEXT NOT NULL,
    "transactionIdentification" TEXT,
    "remittanceInformation" TEXT NOT NULL,
    "authorisationFlow" TEXT,
    "qrCode" TEXT,
    "code" TEXT,
    "detail" TEXT,
    "reason" TEXT,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "creditor_accounts" (
    "_id" TEXT NOT NULL,
    "ispb" TEXT NOT NULL,
    "issuer" TEXT,
    "number" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "creditor_accounts_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "debtor_accounts" (
    "_id" TEXT NOT NULL,
    "ispb" TEXT NOT NULL,
    "issuer" TEXT,
    "number" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "debtor_accounts_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "cancellations" (
    "_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "cancelledFrom" TEXT NOT NULL,
    "cancelledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledByIdentification" TEXT NOT NULL,
    "cancelledByRel" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "cancellations_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "PaymentDetail" (
    "_id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "PaymentDetail_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "automaticPayments" (
    "_id" TEXT NOT NULL,
    "recurringConsentId" TEXT NOT NULL,
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

    CONSTRAINT "automaticPayments_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creditor_accounts_paymentId_key" ON "creditor_accounts"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "debtor_accounts_paymentId_key" ON "debtor_accounts"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "cancellations_paymentId_key" ON "cancellations"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentDetail_paymentId_key" ON "PaymentDetail"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "automaticPayments_recurringConsentId_key" ON "automaticPayments"("recurringConsentId");

-- AddForeignKey
ALTER TABLE "creditor_accounts" ADD CONSTRAINT "creditor_accounts_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debtor_accounts" ADD CONSTRAINT "debtor_accounts_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cancellations" ADD CONSTRAINT "cancellations_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentDetail" ADD CONSTRAINT "PaymentDetail_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
