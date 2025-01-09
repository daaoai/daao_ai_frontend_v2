/*
  Warnings:

  - You are about to drop the column `email` on the `WaitingList` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicKey]` on the table `WaitingList` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicKey` to the `WaitingList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WaitingList" DROP COLUMN "email",
ADD COLUMN     "publicKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WaitingList_publicKey_key" ON "WaitingList"("publicKey");
