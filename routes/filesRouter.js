const { Router } = require('express');
const { getFileDetailsGet, downloadFileGet } = require('../controllers/filesController.js');
const upload = require('../middlewares/upload.js');
const { uploadFilePost } = require('../controllers/foldersController.js');
const { isAuthenticated, checkFileAccess } = require('../middlewares/auth.js');

const filesRouter = Router();

filesRouter.use(isAuthenticated);

filesRouter.get('/:fileId/details', checkFileAccess, getFileDetailsGet);
filesRouter.get('/:fileId', checkFileAccess, downloadFileGet);

filesRouter.post('/', upload.single('uploadfile'), uploadFilePost);

module.exports = filesRouter;