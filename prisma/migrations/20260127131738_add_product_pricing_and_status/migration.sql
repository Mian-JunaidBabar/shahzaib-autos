-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'OUT_OF_STOCK', 'DRAFT', 'ARCHIVED');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "cost_price" INTEGER,
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sale_price" INTEGER,
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE';
