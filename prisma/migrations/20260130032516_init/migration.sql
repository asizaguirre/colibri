/*
  Warnings:

  - The values [REPRODUCTION_SPECIALIST] on the enum `Specialty` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Specialty_new" AS ENUM ('GYNECOLOGIST', 'OBSTETRICIAN', 'PEDIATRICIAN');
ALTER TABLE "Professional" ALTER COLUMN "specialty" TYPE "Specialty_new" USING ("specialty"::text::"Specialty_new");
ALTER TYPE "Specialty" RENAME TO "Specialty_old";
ALTER TYPE "Specialty_new" RENAME TO "Specialty";
DROP TYPE "public"."Specialty_old";
COMMIT;

-- CreateIndex
CREATE INDEX "Appointment_date_idx" ON "Appointment"("date");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE INDEX "Supply_name_idx" ON "Supply"("name");
