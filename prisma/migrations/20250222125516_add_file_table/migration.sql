-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "size" BIGINT NOT NULL,
    "mineType" VARCHAR(255) NOT NULL,
    "folderId" INTEGER,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
