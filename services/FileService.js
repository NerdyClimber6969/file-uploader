const prisma = require("../prisma/prismaClient.js");
const storageService = require('./StorageService.js');
const ServiceError = require('../errors/ServiceError.js');

class FileService {
    static async createFile(file, userId, parentFolderId=null) {
        const exist = await prisma.file.findFirst({
            where: {
                name: file.filename,
                ownerId: userId,
                folderId: parentFolderId 
            }
        });

        if (exist) {
            throw new ServiceError(`File "${file.filename}" already existed, please use another name`);
        };

        const newFile = await prisma.file.create({
            data: {
                id: file.filename.split('.')[0],
                name: file.originalname,
                size: file.size,
                mineType: file.mimetype,
                folderId: parentFolderId,
                ownerId: userId,
            }
        });

        return newFile;
    };

    static async getFile(fileId) {
        const file = await prisma.file.findUnique({
            where: { id: fileId },
            include: { folder: true }
        });

        if (!file) {
            throw new ServiceError('No such file', 404);
        };

        return file;
    };

    static async getStoragePath(username, filename) {
        return storageService.getPath(username, filename);
    };
};

module.exports = FileService;