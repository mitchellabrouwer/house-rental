/*
  Warnings:

  - Added the required column `guests` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "guests" INTEGER NOT NULL,
ADD COLUMN     "pet" BOOLEAN NOT NULL DEFAULT false;
