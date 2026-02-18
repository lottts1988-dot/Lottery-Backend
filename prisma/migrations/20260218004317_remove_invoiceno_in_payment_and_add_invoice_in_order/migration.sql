/*
  Warnings:

  - You are about to drop the column `invoiceno` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceno]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoiceno` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Payment_invoiceno_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "invoiceno" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "invoiceno";

-- CreateIndex
CREATE UNIQUE INDEX "Order_invoiceno_key" ON "Order"("invoiceno");
