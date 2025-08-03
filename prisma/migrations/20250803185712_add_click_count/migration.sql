-- AlterTable
ALTER TABLE "public"."WtfProduct" ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."BookmarkCollection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookmarkCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bookmark" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookmarkCollection_createdAt_idx" ON "public"."BookmarkCollection"("createdAt");

-- CreateIndex
CREATE INDEX "Bookmark_productId_idx" ON "public"."Bookmark"("productId");

-- CreateIndex
CREATE INDEX "Bookmark_collectionId_idx" ON "public"."Bookmark"("collectionId");

-- CreateIndex
CREATE INDEX "Bookmark_createdAt_idx" ON "public"."Bookmark"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_productId_collectionId_key" ON "public"."Bookmark"("productId", "collectionId");

-- CreateIndex
CREATE INDEX "WtfProduct_clickCount_idx" ON "public"."WtfProduct"("clickCount");

-- AddForeignKey
ALTER TABLE "public"."Bookmark" ADD CONSTRAINT "Bookmark_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."BookmarkCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
