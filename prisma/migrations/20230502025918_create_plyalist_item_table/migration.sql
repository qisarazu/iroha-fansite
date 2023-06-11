/*
  Warnings:

  - You are about to drop the `_PlaylistToSingingStream` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlaylistToSingingStream" DROP CONSTRAINT "_PlaylistToSingingStream_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlaylistToSingingStream" DROP CONSTRAINT "_PlaylistToSingingStream_B_fkey";

-- DropTable
DROP TABLE "_PlaylistToSingingStream";

-- CreateTable
CREATE TABLE "PlaylistItem" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "playlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaylistItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_songId_fkey" FOREIGN KEY ("songId") REFERENCES "SingingStream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
