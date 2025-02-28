const StorageService = require('../services/StorageService.js');

async function getFolderContentGet(req, res) {
    const { folderId } =  req.params || null;
    const { files, childrenFolders } = await StorageService.getFolderContent(req.user, folderId);
    const { currentPath, currentIdPath } = await StorageService.getFolderPath(req.user, folderId);

    return res.render('storage', {
        files,
        childrenFolders,
        currentPath,
        currentIdPath, 
        actionUrl: req.originalUrl
    });
};

async function createFolderPost(req, res) {
    const { folderName } = req.body;
    const { folderId: parentFolderId } = req.params || null;
    await StorageService.createFolder(req.user, folderName, parentFolderId);
    return res.redirect(req.originalUrl);
};

async function uploadFilePost(req, res) {
    const { user, file } = req;
    const { folderId } =  req.params || null;
    await StorageService.createFile(user, folderId, file);
    const redirectUrl = folderId ? `/folders/${folderId}` : '/folders';
    return res.redirect(redirectUrl);
};

module.exports = { getFolderContentGet, createFolderPost, uploadFilePost }