/*
  Warnings:

  - You are about to drop the column `consentsConsentId` on the `payments` table. All the data in the column will be lost.
  - Added the required column `consentId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_consentsConsentId_fkey";

-- DropIndex
DROP INDEX "payments_consentsConsentId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "consentsConsentId",
ADD COLUMN     "consentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_consentId_fkey" FOREIGN KEY ("consentId") REFERENCES "consents"("consentId") ON DELETE CASCADE ON UPDATE CASCADE;
