-- CreateTable
CREATE TABLE "Playlist" (
    "id" SERIAL NOT NULL,
    "playlistId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlaylistToSingingStream" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_playlistId_key" ON "Playlist"("playlistId");

-- CreateIndex
CREATE UNIQUE INDEX "_PlaylistToSingingStream_AB_unique" ON "_PlaylistToSingingStream"("A", "B");

-- CreateIndex
CREATE INDEX "_PlaylistToSingingStream_B_index" ON "_PlaylistToSingingStream"("B");

-- AddForeignKey
ALTER TABLE "_PlaylistToSingingStream" ADD CONSTRAINT "_PlaylistToSingingStream_A_fkey" FOREIGN KEY ("A") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaylistToSingingStream" ADD CONSTRAINT "_PlaylistToSingingStream_B_fkey" FOREIGN KEY ("B") REFERENCES "SingingStream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
