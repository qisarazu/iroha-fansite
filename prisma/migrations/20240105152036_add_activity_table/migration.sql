-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('GOODS', 'EVENT');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('ACTIVE', 'HIDDEN', 'SCHEDULED', 'CLOSED');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "status" "ActivityStatus" NOT NULL,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnailURL" TEXT NOT NULL,
    "detailURL" TEXT NOT NULL,
    "isShowTime" BOOLEAN NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "endNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);
