const FileService = require('../services/FileService.js');
const FolderService = require('../services/FolderService.js');

async function getFileDetails(req, res) {
    const { currentPath, currentIdPath } = await FolderService.getPath(req.file.folderId, req.user.id);
    return res.render('file-details', { file: req.file, currentPath, currentIdPath });
};

async function downloadFile(req, res) {
    const { id, mineType } = req.file;
    const ext = mineType.split('/')[1];
    const filePath = await FileService.getStoragePath(req.user.username, `${id}.${ext}`);
    return res.download(filePath);
};

async function uploadFile(req, res) {
    const { user, file } = req;
    const { folderId } =  req.params || null;
    await FileService.createFile(file, user.id, folderId );
    const redirectUrl = folderId ? `/folders/${folderId}` : '/folders';
    return res.redirect(redirectUrl);
};

module.exports = { getFileDetails, downloadFile, uploadFile };