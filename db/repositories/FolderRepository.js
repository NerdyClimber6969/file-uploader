const { Prisma } = require("@prisma/client");
const DatabaseError = require('../../errors/DatabaseError.js');
const { handleUnexpectedError } = require('../../utils/utils');

class FolderRepository {
    #prisma;

    constructor(prisma) {
        this.#prisma = prisma;      
    };

    createFolder = handleUnexpectedError(
        async(userId, folderName, parentFolderId=null) => {
            const folder = await this.#prisma.folder.create({
                data: {
                    ownerId: userId,
                    name: folderName,
                    parentId: parentFolderId,
                }
            });
            return folder;
        },
        DatabaseError.handle
    );

    getFolder = handleUnexpectedError(
        async (userId, folderId) => {
            const folder = await this.#prisma.folder.findUnique({
                where: { 
                    id: folderId,
                    ownerId: userId
                }
            });

            return folder;
        },
        DatabaseError.handle
    );

    getFolderContent = handleUnexpectedError(
        async (userId, folderId=null) => {
            const content = await this.#prisma.user.findUnique({
                where: {
                  id: userId
                },
                select: {
                  id: true,
                  username: true,
                  folders: {
                    where: {
                      parentId: folderId
                    }
                  },
                  files: {
                    where: {
                      folderId: folderId
                    }
                  }
                }
            });

            return content;
        },
        DatabaseError.handle
    );

    deleteFolder = handleUnexpectedError(
        async(userId, folderId) => {
            const deleted = await this.#prisma.folder.delete({
                where: {
                    ownerId: userId,
                    id: folderId
                },
            });

            return deleted;
        },

        DatabaseError.handle
    );

    getFolderPath = handleUnexpectedError(
        async(userId, folderId) => {
            const folderPath = await this.#prisma.$queryRaw`
                WITH RECURSIVE folder_path AS (
                    SELECT 
                        name, "Folder"."id", "Folder"."parentId", "Folder"."ownerId",
                        ARRAY[name]::VARCHAR[] AS currentPath,
                        ARRAY["Folder"."id"]::VARCHAR[] AS currentIdPath
                    FROM "Folder"
                    WHERE "Folder"."id" = ${folderId} AND "Folder"."ownerId" = ${userId}

                    UNION ALL

                    SELECT 
                        "r_folder".name, "r_folder"."id", "r_folder"."parentId", "fp"."ownerId", 
                        ARRAY_PREPEND("r_folder".name, fp.currentPath) AS currentPath,
                        ARRAY_PREPEND("r_folder"."id", fp.currentIdPath) AS currentIdPath
                    FROM "Folder" AS r_folder
                    JOIN folder_path AS fp ON "fp"."parentId" = "r_folder"."id"
                )
                SELECT 
                    currentPath,
                    currentIdPath
                FROM folder_path AS fp WHERE "fp"."parentId" IS NULL;
            `;

            return folderPath;
        },
        DatabaseError.handle
    );

    searchChildFolder = handleUnexpectedError(
        async(userId, targetFolderName, parentFolderId=null) => {
            const childFolder = await this.#prisma.folder.findFirst({
                where: { 
                    ownerId: userId,
                    parentId: parentFolderId,
                    name: targetFolderName
                }
            });
            if (!childFolder) return false;
            return true;
        },
        DatabaseError.handle
    );
};

module.exports = FolderRepository;