/*
  Warnings:

  - Added the required column `isSelect` to the `Lottery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lottery" ADD COLUMN     "isSelect" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "invoiceno" TEXT NOT NULL,
    "ticketlist" JSONB[],
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "saleDate" TEXT NOT NULL,
    "screenshot" TEXT NOT NULL,
    "t1" TEXT,
    "t2" TEXT,
    "t3" TEXT,
    "t4" TEXT,
    "t5" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "qrcode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "paymentid" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_invoiceno_key" ON "Payment"("invoiceno");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentid_fkey" FOREIGN KEY ("paymentid") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
