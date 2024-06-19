-- init-postgres.sql

-- Criação da base "payments"
CREATE DATABASE payments;
\c payments;

-- Criação da base "pix"
CREATE DATABASE pix;
\c pix;

CREATE TABLE "pix" (
    "transactionId" SERIAL NOT NULL,
    "creationDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusUpdateDateTime" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "clientCode" TEXT NOT NULL,
    "debitAccount" TEXT NOT NULL,
    "debitBranch" INTEGER NOT NULL,
    "debitTaxId" TEXT NOT NULL,
    "debitAccountTyp" TEXT NOT NULL,
    "debitName" TEXT NOT NULL,
    "creditKey" TEXT,
    "creditBank" TEXT NOT NULL,
    "creditAccount" TEXT NOT NULL,
    "creditBranch" INTEGER NOT NULL,
    "creditTaxId" TEXT NOT NULL,
    "creditAccountTyp" TEXT NOT NULL,
    "creditName" TEXT NOT NULL,
    "endToEndId" TEXT NOT NULL,
    "initiationType" TEXT NOT NULL,
    "remittanceInformation" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" BOOLEAN NOT NULL,

    CONSTRAINT "pix_pkey" PRIMARY KEY ("transactionId")
);