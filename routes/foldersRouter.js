const { Router } = require('express');
const { getFolderContent, createFolder } = require('../controllers/foldersController.js');
const { uploadFile } = require('../controllers/filesController.js');
const upload = require('../middlewares/upload.js');
const { isAuthenticated, checkFolderAccess } = require('../middlewares/auth.js');
const foldersRouter = Router();

foldersRouter.use(isAuthenticated);

foldersRouter.get('/', getFolderContent);
foldersRouter.get('/:folderId', checkFolderAccess, getFolderContent);

foldersRouter.post('/', createFolder);
foldersRouter.post('/:folderId', checkFolderAccess, createFolder);

foldersRouter.post('/files', upload.single('uploadfile'), uploadFile);
foldersRouter.post('/:folderId/files', checkFolderAccess, upload.single('uploadfile'), uploadFile);

module.exports = foldersRouter;