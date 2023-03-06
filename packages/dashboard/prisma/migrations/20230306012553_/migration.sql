/*
  Warnings:

  - You are about to drop the column `content` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Document` DROP COLUMN `content`;

-- CreateTable
CREATE TABLE `DocumentData` (
    `id` VARCHAR(191) NOT NULL,
    `data` LONGBLOB NOT NULL,

    UNIQUE INDEX `DocumentData_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DocumentData` ADD CONSTRAINT `DocumentData_id_fkey` FOREIGN KEY (`id`) REFERENCES `Document`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
