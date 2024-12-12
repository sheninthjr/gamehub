-- CreateEnum
CREATE TYPE "Game" AS ENUM ('XOXO', 'SUDOKU', 'MINES', 'CHESS');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('SOLO', 'MULTI');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('STARTED', 'PROGRESS', 'GAMEOVER');

-- CreateEnum
CREATE TYPE "Result" AS ENUM ('X', 'O', 'DRAW');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GameHistory" (
    "id" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL,
    "gameId" TEXT NOT NULL,
    "gameName" "Game" NOT NULL,
    "gameStatus" "GameStatus" NOT NULL,
    "player1" TEXT NOT NULL,
    "player2" TEXT,
    "result" "Result",
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GameHistory_id_key" ON "GameHistory"("id");

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
