const FolderService = require('../services/FolderService.js');

async function getFolderContent(req, res) {
    const { folderId } =  req.params || null;
    const { files, childrenFolders } = await FolderService.getFolderContent(folderId, req.user.id);
    const { currentPath, currentIdPath } = await FolderService.getPath(folderId, req.user.id);

    return res.render('storage', {
        files,
        childrenFolders,
        currentPath,
        currentIdPath, 
        actionUrl: req.originalUrl
    });
};

async function createFolder(req, res) {
    const { folderName } = req.body;
    const { folderId: parentFolderId } = req.params || null;
    await FolderService.createFolder(folderName, req.user.id, parentFolderId);
    return res.redirect(req.originalUrl);
};

module.exports = { getFolderContent, createFolder}