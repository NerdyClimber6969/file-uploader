const StorageService = require('../services/StorageService.js');
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
    const folder = await StorageService.getFolder(req.user, folderId);
    req.folder = folder;
    return next();
});

const checkFileAccess = asyncHandler(async(req, res, next) => {
    const { fileId } = req.params;
    const file = await StorageService.getFile(req.user, fileId);
    req.file = file;
    return next();
});

module.exports = { isAuthenticated, checkFileAccess, checkFolderAccess }
