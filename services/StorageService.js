const prisma = require('../db/prismaClient.js');
const fs = require('node:fs');
const path = require('node:path');
const FileRepository = require('../db/repositories/FileRepository.js');
const FolderRepository = require('../db/repositories/FolderRepository.js');
const UserRepository = require('../db/repositories/UserRepository.js');
const ServiceError = require('../errors/ServiceError.js');
const SystemStorageError = require('../errors/StorageSystemError.js');
const { handleUnexpectedError } = require('../utils/utils.js');
const bcryptjs = require('bcryptjs');

class SystemStorage {
    #root

    constructor(root) {
        this.#root = path.resolve(root);
    };

    createFolder = handleUnexpectedError(
        async(name) => {
            fs.mkdirSync(path.join(this.#root, name), { recursive: false });
            return true;
        }, 
        SystemStorageError.handle
    );

    deleteFile = handleUnexpectedError(
        async(username, filename) => {
            fs.rmSync(path.join(this.#root, username, filename), { recursive: true });
            return true;
        },
        SystemStorageError.handle
    );

    search(username, filename=null) {
        if (!filename) {
            filename = ''
        };
        const fullpath = path.join(this.#root, username, filename)

        if (!fs.existsSync(fullpath)) {
            return false;
        };

        return fullpath;
    };
};


class StorageService {
    #fileRepository;
    #folderRepository;
    #userRepository;
    #systemStorage;
    
    constructor(prisma) {
        this.#fileRepository = new FileRepository(prisma);
        this.#folderRepository = new FolderRepository(prisma);
        this.#userRepository = new UserRepository(prisma);
        this.#systemStorage = new SystemStorage("./storage");
    };

    async createFile(user, parentFolderId=null, file) {
        const existed = await this.#fileRepository.searchFile(user.id, parentFolderId, file.filename);
        if (existed) {
            throw new ServiceError(`File ${file.filename} already existed, please use another filename`);
        };

        const newFile = await this.#fileRepository.createFile(
            user.id, 
            parentFolderId, 
            file.filename.split('.')[0], 
            file.originalname, 
            file.size, 
            file.mimetype
        );
        return newFile;
    };

    async getFile(user, fileId) {
        const file = await this.#fileRepository.getFile(user.id, fileId);
        if (!file) {
            throw new ServiceError('No such file', 404);
        };

        return file;
    };


    async createFolder(user, folderName, parentFolderId=null) {
        const existed = await this.#folderRepository.searchChildFolder(user.id, folderName, parentFolderId);
        if (existed) {
            throw new ServiceError(`Folder "${folderName}" already existed, please use another name`);
        };

        const newFolder = await this.#folderRepository.createFolder(user.id, folderName, parentFolderId);  
        return newFolder;
    };

    async getFolder(user, folderId) {
        const folder = await this.#folderRepository.getFolder(user.id, folderId);
        if (!folder) {
            throw new ServiceError('No such folder', 404);
        };

        return folder;
    };

    async getFolderContent(user, folderId=null) {
        const { files, folders: childrenFolders } = await this.#folderRepository.getFolderContent(user.id, folderId);
        return { 
            files,
            childrenFolders
        };
    };

    async deleteFolder(user, folderId) {
        const deleted = await this.#folderRepository.deleteFolder(user.id, folderId);
        if (!deleted) {
            throw new ServiceError(`Folder "${folderName}" not found, deletion unsucessful`);
        };

        return deleted;
    };

    async getFolderPath(user, folderId=null) {
        if (!folderId) {
            return { currentPath: [], currentIdPath: [] };
        };

        const [ { currentpath, currentidpath } ] = await this.#folderRepository.getFolderPath(user.id, folderId);

        return {
            currentPath: currentpath,
            currentIdPath: currentidpath
        };
    };

    async getFileStoragePath(user, filename) {
        const filePath = this.#systemStorage.search(user.username, filename)
        if (!filePath) {
            throw new ServiceError('No such file', 404)
        };

        return filePath;
    };

    async createUser(newUserData) {
        const { username, firstName, lastName, password } = newUserData;
        const userExisted = await this.#userRepository.searchUser(username);
        const userStoragePath = this.#systemStorage.search(username);

        if (userExisted || userStoragePath) {
            throw new ServiceError(`User ${username} already existed, please use another username`);
        };

        const hash = await bcryptjs.hash(password, 10);
        const newUser = await this.#userRepository.createUser(username, firstName, lastName, hash);
        await this.#systemStorage.createFolder(username);

        return newUser;
    };
};

module.exports = new StorageService(prisma);