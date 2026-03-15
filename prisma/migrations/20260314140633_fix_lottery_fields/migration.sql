/*
  Warnings:

  - You are about to drop the column `desc` on the `Lottery` table. All the data in the column will be lost.
  - You are about to drop the column `isSelect` on the `Lottery` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `Lottery` table. All the data in the column will be lost.
  - You are about to drop the column `org` on the `Lottery` table. All the data in the column will be lost.
  - You are about to drop the column `terms` on the `Lottery` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Lottery` table. All the data in the column will be lost.
  - You are about to drop the column `qrcode` on the `Order` table. All the data in the column will be lost.
  - Added the required column `date` to the `Lottery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Lottery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lottery" DROP COLUMN "desc",
DROP COLUMN "isSelect",
DROP COLUMN "logo",
DROP COLUMN "org",
DROP COLUMN "terms",
DROP COLUMN "title",
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "qrcode";
