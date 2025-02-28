const StorageService = require('../services/StorageService.js');

async function getFileDetailsGet(req, res) {
    const { folderId } = req.params;
    const { currentPath, currentIdPath } = await StorageService.getFolderPath(req.user, folderId);

    return res.render('file-details', { file: req.file, currentPath, currentIdPath });
};

async function downloadFileGet(req, res) {
    const { id, mineType } = req.file;
    const ext = mineType.split('/')[1];
    const filePath = await StorageService.getFileStoragePath(req.user, `${id}.${ext}`);
    
    return res.download(filePath);
};

module.exports = { getFileDetailsGet, downloadFileGet };