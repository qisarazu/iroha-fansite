/*
  Warnings:

  - Made the column `thumbnailDefaultUrl` on table `Video` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thumbnailHighUrl` on table `Video` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thumbnailMediumUrl` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "thumbnailDefaultUrl" SET NOT NULL,
ALTER COLUMN "thumbnailHighUrl" SET NOT NULL,
ALTER COLUMN "thumbnailMediumUrl" SET NOT NULL;
