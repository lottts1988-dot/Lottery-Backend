-- CreateTable
CREATE TABLE "Lottery" (
    "id" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "org" JSONB[],
    "terms" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "t1" TEXT,
    "t2" TEXT,
    "t3" TEXT,
    "t4" TEXT,
    "t5" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userid" TEXT NOT NULL,

    CONSTRAINT "Lottery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lottery" ADD CONSTRAINT "Lottery_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
