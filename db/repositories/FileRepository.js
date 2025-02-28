const DatabaseError = require('../../errors/DatabaseError');
const { handleUnexpectedError } = require('../../utils/utils');

class FileRepository {
    #prisma;

    constructor(prisma) {
        this.#prisma = prisma;
    }

    createFile = handleUnexpectedError(
        async (userId, folderId=null, fileId, filename, size, mineType) => {
            return await this.#prisma.file.create({
                data: {
                    id: fileId,
                    name: filename,
                    size: size,
                    mineType: mineType,
                    folderId: folderId,
                    ownerId: userId,
                }
            });
        },
        DatabaseError.handle
    );

    getFile = handleUnexpectedError(
        async (userId, fileId) => {
            return await this.#prisma.file.findUnique({
                where: {
                    id: fileId,
                    ownerId: userId
                }
            });
        },
        DatabaseError.handle
    );

    async getFiles(userId, parentFolderId=null) {
        const files = await this.#prisma.file.findMany({
            where: {
                ownerId: userId,
                folderId: parentFolderId
            }
        });

        return files;
    };

    async searchFile(userId, folderId=null, filename) {
        const file  = await this.#prisma.file.findFirst({
            where: {
                ownerId: userId,
                folderId: folderId,
                name: filename,
            }
        });

        if (!file) {
            return false;
        };

        return true;
    };
};

module.exports = FileRepository;