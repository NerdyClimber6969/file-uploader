const ServiceError = require('../errors/ServiceError');

const validateUsername = (username) => {
    if (!username || typeof username !== 'string' || username.length < 3) {
        throw new ServiceError('Invalid username. Must be at least 3 characters long.');
    }
};

const validateFileName = (fileName) => {
    if (!fileName || typeof fileName !== 'string' || /[<>:"/\\|?*]/.test(fileName)) {
        throw new ServiceError('Invalid filename. Must not contain special characters.');
    }
};

const validateFolderName = (folderName) => {
    if (!folderName || typeof folderName !== 'string' || /[<>:"/\\|?*]/.test(folderName)) {
        throw new ServiceError('Invalid folder name. Must not contain special characters.');
    }
};

module.exports = {
    validateUsername,
    validateFileName,
    validateFolderName
};
