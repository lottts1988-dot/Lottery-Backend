/*
  Warnings:

  - The `purchasedate` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "purchasedate",
ADD COLUMN     "purchasedate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
