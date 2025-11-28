-- CreateEnum
CREATE TYPE "DeliveryZone" AS ENUM ('INSIDE_DHAKA', 'OUTSIDE_DHAKA');

-- CreateTable
CREATE TABLE "DeliveryCost" (
    "id" TEXT NOT NULL,
    "zone" "DeliveryZone" NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryCost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryCost_zone_key" ON "DeliveryCost"("zone");

-- CreateIndex
CREATE INDEX "DeliveryCost_zone_idx" ON "DeliveryCost"("zone");
