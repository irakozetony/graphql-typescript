/*
  Warnings:

  - You are about to drop the column `description` on the `FlashCard` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `FlashCard` table. All the data in the column will be lost.
  - Added the required column `back` to the `FlashCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `front` to the `FlashCard` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FlashCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL
);
INSERT INTO "new_FlashCard" ("createdAt", "id") SELECT "createdAt", "id" FROM "FlashCard";
DROP TABLE "FlashCard";
ALTER TABLE "new_FlashCard" RENAME TO "FlashCard";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
