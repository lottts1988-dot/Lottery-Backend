/*
  Warnings:

  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "t1" TEXT,
ADD COLUMN     "t2" TEXT,
ADD COLUMN     "t3" TEXT,
ADD COLUMN     "t4" TEXT,
ADD COLUMN     "t5" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
