/*
  Warnings:

  - You are about to drop the column `salary` on the `Payroll` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,paymentMonth,paymentYear]` on the table `Payroll` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `baseSalary` to the `Payroll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMonth` to the `Payroll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentYear` to the `Payroll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payroll` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Payroll` DROP FOREIGN KEY `Payroll_userId_fkey`;

-- AlterTable
ALTER TABLE `Payroll` DROP COLUMN `salary`,
    ADD COLUMN `absentDays` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `baseSalary` DOUBLE NOT NULL,
    ADD COLUMN `bonuses` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `calculatedSalary` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deductions` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `paymentMonth` INTEGER NOT NULL,
    ADD COLUMN `paymentYear` INTEGER NOT NULL,
    ADD COLUMN `presentDays` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `totalSalary` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `workingDays` DOUBLE NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `Payroll_userId_paymentMonth_paymentYear_key` ON `Payroll`(`userId`, `paymentMonth`, `paymentYear`);

-- AddForeignKey
ALTER TABLE `Payroll` ADD CONSTRAINT `Payroll_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
