/*
  Warnings:

  - Added the required column `nota` to the `Feedbacks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feedbacks" ADD COLUMN     "nota" INTEGER NOT NULL;
