/*
  Warnings:

  - You are about to drop the column `proxy` on the `consents` table. All the data in the column will be lost.
  - Added the required column `accountTypeCreditor` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountTypeDebtor` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ispbCreditor` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ispbDebtor` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuerCreditor` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuerDebtor` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberCreditor` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberDebtor` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "consents" DROP COLUMN "proxy";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "accountTypeCreditor" TEXT NOT NULL,
ADD COLUMN     "accountTypeDebtor" TEXT NOT NULL,
ADD COLUMN     "ispbCreditor" TEXT NOT NULL,
ADD COLUMN     "ispbDebtor" TEXT NOT NULL,
ADD COLUMN     "issuerCreditor" TEXT NOT NULL,
ADD COLUMN     "issuerDebtor" TEXT NOT NULL,
ADD COLUMN     "numberCreditor" TEXT NOT NULL,
ADD COLUMN     "numberDebtor" TEXT NOT NULL;
