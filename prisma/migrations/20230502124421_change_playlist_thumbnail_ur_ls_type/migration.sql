/*
  Warnings:

  - The `thumbnailURLs` column on the `Playlist` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "thumbnailURLs",
ADD COLUMN     "thumbnailURLs" TEXT[] DEFAULT ARRAY[]::TEXT[];
