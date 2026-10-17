/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `reservations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `reservations_userId_eventId_key` ON `reservations`(`userId`, `eventId`);
