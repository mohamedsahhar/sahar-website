-- CreateTable
CREATE TABLE "RepairCase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "RepairCase_slug_key" ON "RepairCase"("slug");
