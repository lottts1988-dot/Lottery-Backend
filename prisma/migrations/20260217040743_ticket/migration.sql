-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "alphabet" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "annoucedate" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "t1" TEXT,
    "t2" TEXT,
    "t3" TEXT,
    "t4" TEXT,
    "t5" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);
