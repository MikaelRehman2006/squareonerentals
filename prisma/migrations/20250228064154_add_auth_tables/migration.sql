-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "hashedPassword" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "size" REAL NOT NULL,
    "images" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" REAL NOT NULL,
    "amenities" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "leaseType" TEXT NOT NULL,
    "leaseDuration" TEXT NOT NULL,
    "availabilityDate" DATETIME NOT NULL,
    "petFriendly" BOOLEAN NOT NULL,
    "parking" BOOLEAN NOT NULL,
    "buildingAmenities" TEXT NOT NULL,
    "landlordName" TEXT NOT NULL,
    "landlordEmail" TEXT NOT NULL,
    "landlordPhone" TEXT NOT NULL,
    "featuresId" TEXT NOT NULL,
    "utilitiesId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Listing_featuresId_fkey" FOREIGN KEY ("featuresId") REFERENCES "Features" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_utilitiesId_fkey" FOREIGN KEY ("utilitiesId") REFERENCES "Utilities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Features" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wifi" BOOLEAN NOT NULL,
    "laundry" BOOLEAN NOT NULL,
    "furnished" BOOLEAN NOT NULL,
    "airConditioning" BOOLEAN NOT NULL,
    "heating" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Utilities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "electricity" BOOLEAN NOT NULL,
    "water" BOOLEAN NOT NULL,
    "internet" BOOLEAN NOT NULL,
    "gas" BOOLEAN NOT NULL,
    "heating" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "_UserFavorites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_featuresId_key" ON "Listing"("featuresId");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_utilitiesId_key" ON "Listing"("utilitiesId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavorites_AB_unique" ON "_UserFavorites"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavorites_B_index" ON "_UserFavorites"("B");
