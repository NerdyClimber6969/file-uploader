const fs = require('node:fs');
const path = require('node:path');

class LocalStorage {
    #root

    constructor(root) {
        this.#root = path.join(process.cwd(), root);
    };

    create(folderName) {
        fs.mkdirSync(path.join(this.#root, folderName), { recursive: false });
        return true;
    };

    deleteFile (folderName, filename)  {
        fs.rmSync(path.join(this.#root, folderName, filename), { recursive: true });
        return true;
    };

    search(folderName, filename=null) {
        if (!filename) {
            filename = '';
        };
        const fullpath = path.join(this.#root, folderName, filename)

        if (!fs.existsSync(fullpath)) {
            return false;
        };

        return fullpath;
    };
};

class StorageService {
    #provider;
    
    constructor(provider) {
        this.#provider = provider;
    };

    create(username) {
        return this.#provider.create(username);
    };

    getPath(username, filename=null) {
        return this.#provider.search(username, filename);
    };
};

const localStorage = new LocalStorage('storage');
module.exports = new StorageService(localStorage);