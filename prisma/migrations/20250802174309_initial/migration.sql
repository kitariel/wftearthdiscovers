/*
  Warnings:

  - Added the required column `platformType` to the `WtfProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."WtfProduct" ADD COLUMN     "platformType" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "WtfProduct_title_idx" ON "public"."WtfProduct"("title");

-- CreateIndex
CREATE INDEX "WtfProduct_tags_idx" ON "public"."WtfProduct"("tags");
