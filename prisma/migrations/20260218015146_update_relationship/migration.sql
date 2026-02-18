/*
  Warnings:

  - You are about to drop the column `ticketlist` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "ticketlist";

-- CreateTable
CREATE TABLE "_TicketPayments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TicketPayments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TicketPayments_B_index" ON "_TicketPayments"("B");

-- AddForeignKey
ALTER TABLE "_TicketPayments" ADD CONSTRAINT "_TicketPayments_A_fkey" FOREIGN KEY ("A") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketPayments" ADD CONSTRAINT "_TicketPayments_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
