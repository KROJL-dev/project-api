-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "meetingIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
