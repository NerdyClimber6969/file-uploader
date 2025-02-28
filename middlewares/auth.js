const fileService = require('../services/FileService.js');
const folderService = require('../services/FolderService.js');
const asyncHandler = require('express-async-handler');
const ServiceError = require('../errors/ServiceError.js');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

const checkFolderAccess = asyncHandler(async(req, res, next) => {
    const { folderId } = req.params;
    const folder = await folderService.getFolder(folderId);

    if (folder.ownerId !== req.user.id) {
        throw new ServiceError('Access denied');
    };

    req.folder = folder;
    return next();
});

const checkFileAccess = asyncHandler(async(req, res, next) => {
    const { fileId } = req.params;
    const file = await fileService.getFile(fileId);

    if (file.ownerId !== req.user.id) {
        throw new ServiceError('Access denied');
    };

    req.file = file;
    return next();
});

module.exports = { isAuthenticated, checkFileAccess, checkFolderAccess }
