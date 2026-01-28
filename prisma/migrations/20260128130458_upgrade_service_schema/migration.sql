-- CreateEnum
CREATE TYPE "ServiceLocation" AS ENUM ('WORKSHOP', 'HOME', 'BOTH');

-- AlterTable
ALTER TABLE "services" ADD COLUMN "location" "ServiceLocation" NOT NULL DEFAULT 'BOTH',
ADD COLUMN "features" TEXT[] DEFAULT ARRAY[]::TEXT[];
