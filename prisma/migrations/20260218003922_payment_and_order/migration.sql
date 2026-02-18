/*
  Warnings:

  - You are about to drop the column `saleDate` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `lotteryid` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchasedate` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "lotteryid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "saleDate",
ADD COLUMN     "purchasedate" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_lotteryid_fkey" FOREIGN KEY ("lotteryid") REFERENCES "Lottery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
