-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "hash" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
