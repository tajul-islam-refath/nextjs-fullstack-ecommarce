/*
  Warnings:

  - You are about to drop the `GuestSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "GuestSession";

-- CreateTable
CREATE TABLE "guest_sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guest_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guest_sessions_session_token_key" ON "guest_sessions"("session_token");
