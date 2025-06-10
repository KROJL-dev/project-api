/*
  Warnings:

  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_userId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_applicationId_fkey";

-- DropTable
DROP TABLE "Application";

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "order" INTEGER NOT NULL DEFAULT 0,
    "link" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "meetingIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[],

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
