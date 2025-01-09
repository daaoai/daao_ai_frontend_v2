-- CreateTable
CREATE TABLE "WaitingList" (
    "id" SERIAL NOT NULL,
    "publicKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitingList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaitingList_publicKey_key" ON "WaitingList"("publicKey");
