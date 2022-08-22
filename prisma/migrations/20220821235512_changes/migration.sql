/*
  Warnings:

  - Added the required column `tax` to the `LineItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LineItem" ADD COLUMN     "tax" TEXT NOT NULL;
