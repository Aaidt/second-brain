/*
  Warnings:

  - Added the required column `sender` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sender" AS ENUM ('AI', 'USER');

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sender" "Sender" NOT NULL;

-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
