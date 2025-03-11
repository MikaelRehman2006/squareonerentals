/*
  Warnings:

  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `landlordEmail` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Activity";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Update existing records to ensure array fields are valid JSON
UPDATE "Listing"
SET 
  "images" = CASE 
    WHEN "images" IS NULL OR "images" = '' THEN '[]'
    WHEN "images" LIKE '[%]' THEN "images"
    ELSE json_array("images")
  END,
  "amenities" = CASE 
    WHEN "amenities" IS NULL OR "amenities" = '' THEN '[]'
    WHEN "amenities" LIKE '[%]' THEN "amenities"
    ELSE json_array("amenities")
  END,
  "buildingAmenities" = CASE 
    WHEN "buildingAmenities" IS NULL OR "buildingAmenities" = '' THEN '[]'
    WHEN "buildingAmenities" LIKE '[%]' THEN "buildingAmenities"
    ELSE json_array("buildingAmenities")
  END;

CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "amenities" TEXT NOT NULL DEFAULT '[]',
    "buildingAmenities" TEXT NOT NULL DEFAULT '[]',
    "propertyType" TEXT NOT NULL,
    "leaseType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "landlordEmail" TEXT NOT NULL DEFAULT '',
    "landlordPhone" TEXT,
    CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Listing" (
    "id", "title", "description", "price", "location", "images", 
    "bedrooms", "bathrooms", "size", "amenities", "buildingAmenities", 
    "propertyType", "leaseType", "createdAt", "updatedAt", "userId", 
    "status", "featured", "landlordEmail", "landlordPhone"
) 
SELECT 
    "id", "title", "description", "price", "location", "images",
    "bedrooms", "bathrooms", "size", "amenities", "buildingAmenities",
    "propertyType", "leaseType", "createdAt", "updatedAt", "userId",
    "status", "featured", '', NULL
FROM "Listing";

DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE INDEX "Listing_userId_idx" ON "Listing"("userId");
CREATE INDEX "Listing_status_idx" ON "Listing"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
