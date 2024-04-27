/*
  Warnings:

  - You are about to drop the column `consentsRecurringConsentId` on the `automaticPayments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recurringConsentId]` on the table `automaticPayments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recurringConsentId` to the `automaticPayments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "automaticPayments" DROP CONSTRAINT "automaticPayments_consentsRecurringConsentId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_consentId_fkey";

-- DropIndex
DROP INDEX "automaticPayments_consentsRecurringConsentId_key";

-- AlterTable
ALTER TABLE "automaticPayments" DROP COLUMN "consentsRecurringConsentId",
ADD COLUMN     "recurringConsentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "automaticPayments_recurringConsentId_key" ON "automaticPayments"("recurringConsentId");
