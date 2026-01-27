/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sku` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add columns (sku as nullable initially)
ALTER TABLE "products" ADD COLUMN "barcode" TEXT;
ALTER TABLE "products" ADD COLUMN "sku" TEXT;

-- Generate unique SKUs for existing products based on ID prefix
UPDATE "products" SET "sku" = CONCAT('SKU-', UPPER(SUBSTRING(id::text, 1, 8))) WHERE "sku" IS NULL;

-- Make sku NOT NULL after populating
ALTER TABLE "products" ALTER COLUMN "sku" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");
