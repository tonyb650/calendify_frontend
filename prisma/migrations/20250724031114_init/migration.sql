/*
  Warnings:

  - You are about to drop the column `end` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `end`,
    DROP COLUMN `start`;
