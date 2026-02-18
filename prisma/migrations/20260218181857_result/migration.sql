-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "t1" TEXT,
    "t2" TEXT,
    "t3" TEXT,
    "t4" TEXT,
    "t5" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userid" TEXT NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
