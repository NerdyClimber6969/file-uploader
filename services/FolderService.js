const prisma = require("../prisma/prismaClient.js");
const ServiceError = require('../errors/ServiceError.js');

class FolderService {
    static async createFolder(folderName, userId, parentFolderId=null) {
        const existed = await prisma.folder.findFirst({
            where: { 
                ownerId: userId,
                parentId: parentFolderId,
                name: folderName
            }
        });

        if (existed) {
            throw new ServiceError(`Folder "${folderName}" already existed, please use another name`);
        };

        const newFolder = await prisma.folder.create({
            data: {
                ownerId: userId,
                name: folderName,
                parentId: parentFolderId,
            }
        });

        return newFolder;
    };

    static async getFolder(folderId) {
        const folder = await prisma.folder.findUnique({ where: { id: folderId } });

        if (!folder) {
            throw new ServiceError('No such folder', 404);
        };

        return folder;
    };

    static async getFolderContent(folderId=null, userId) {
        // If folderId is null, get root level content
        const { files, folders: childrenFolders } = await prisma.user.findUnique({
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

        return { 
            files,
            childrenFolders
        };
    };

    static async getPath(folderId=null, userId) {
        // If folderId is null, get root level and return empty arrays;
        if (!folderId) {
            return { currentPath: [], currentIdPath: [] };
        };

        const [ { currentpath, currentidpath } ] = await prisma.$queryRaw`
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

        return {
            currentPath: currentpath, 
            currentIdPath: currentidpath
        };
    };
};

module.exports = FolderService;