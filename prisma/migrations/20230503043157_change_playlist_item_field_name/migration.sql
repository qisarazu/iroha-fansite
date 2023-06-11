/*
  Warnings:

  - You are about to drop the column `songId` on the `PlaylistItem` table. All the data in the column will be lost.
  - Added the required column `musicId` to the `PlaylistItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlaylistItem" DROP CONSTRAINT "PlaylistItem_songId_fkey";

-- AlterTable
ALTER TABLE "PlaylistItem" DROP COLUMN "songId",
ADD COLUMN     "musicId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "SingingStream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
