-- CreateTable
CREATE TABLE "public"."WtfProduct" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "affiliateLink" TEXT NOT NULL,
    "tags" TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WtfProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WtfProduct_isFeatured_idx" ON "public"."WtfProduct"("isFeatured");

-- CreateIndex
CREATE INDEX "WtfProduct_createdAt_idx" ON "public"."WtfProduct"("createdAt");
