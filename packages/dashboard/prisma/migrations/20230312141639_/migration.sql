/*
  Warnings:

  - You are about to drop the `DocumentData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `DocumentData` DROP FOREIGN KEY `DocumentData_id_fkey`;

-- AlterTable
ALTER TABLE `Document` ADD COLUMN `data` LONGBLOB NULL;

-- DropTable
DROP TABLE `DocumentData`;
