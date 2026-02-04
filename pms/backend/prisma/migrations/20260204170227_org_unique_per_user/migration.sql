/*
  Warnings:

  - A unique constraint covering the columns `[createdBy,name]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `organizations_name_key` ON `organizations`;

-- CreateIndex
CREATE UNIQUE INDEX `organizations_createdBy_name_key` ON `organizations`(`createdBy`, `name`);
