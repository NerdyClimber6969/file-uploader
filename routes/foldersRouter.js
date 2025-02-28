const { Router } = require('express');
const { getFolderContentGet, createFolderPost, uploadFilePost } = require('../controllers/foldersController.js');
const upload = require('../middlewares/upload.js');
const foldersRouter = Router();
const { isAuthenticated, checkFolderAccess } = require('../middlewares/auth.js');

foldersRouter.use(isAuthenticated);

foldersRouter.get('/', getFolderContentGet);
foldersRouter.get('/:folderId', checkFolderAccess, getFolderContentGet);

foldersRouter.post('/', createFolderPost);
foldersRouter.post('/:folderId', checkFolderAccess, createFolderPost);

foldersRouter.post('/files', upload.single('uploadfile'), uploadFilePost);
foldersRouter.post('/:folderId/files', checkFolderAccess, upload.single('uploadfile'), uploadFilePost);

module.exports = foldersRouter;