/*
  Warnings:

  - A unique constraint covering the columns `[playlistId,musicId]` on the table `PlaylistItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlaylistItem_playlistId_musicId_key" ON "PlaylistItem"("playlistId", "musicId");
