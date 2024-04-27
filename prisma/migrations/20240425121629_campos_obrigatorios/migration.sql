-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "transactionIdentification" DROP NOT NULL,
ALTER COLUMN "authorisationFlow" DROP NOT NULL;
