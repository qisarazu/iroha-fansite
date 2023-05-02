/*
  Warnings:

  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `playlistId` on the `Playlist` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PlaylistToSingingStream" DROP CONSTRAINT "_PlaylistToSingingStream_A_fkey";

-- DropIndex
DROP INDEX "Playlist_playlistId_key";

-- AlterTable
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_pkey",
DROP COLUMN "playlistId",
ADD COLUMN     "ownerId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Playlist_id_seq";

-- AlterTable
ALTER TABLE "_PlaylistToSingingStream" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "_PlaylistToSingingStream" ADD CONSTRAINT "_PlaylistToSingingStream_A_fkey" FOREIGN KEY ("A") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
