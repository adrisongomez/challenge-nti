/*
  Warnings:

  - Added the required column `createdBy` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvoicePayType" AS ENUM ('CASH', 'CREDICT_CARD', 'CHECK', 'DEBT');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('OPEN', 'CLOSE');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "down" BOOLEAN,
ADD COLUMN     "downAt" TIMESTAMP(3),
ADD COLUMN     "downBy" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "down" BOOLEAN,
ADD COLUMN     "downAt" TIMESTAMP(3),
ADD COLUMN     "downBy" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "down" BOOLEAN,
ADD COLUMN     "downAt" TIMESTAMP(3),
ADD COLUMN     "downBy" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Invoice" (
    "id" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "notes" TEXT,
    "status" "InvoiceStatus" NOT NULL,
    "pay_type" "InvoicePayType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "down" BOOLEAN,
    "downBy" TEXT,
    "downAt" TIMESTAMP(3),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
