const { Router } = require('express');
const { getFileDetails, downloadFile, uploadFile } = require('../controllers/filesController.js');
const upload = require('../middlewares/upload.js');
const { isAuthenticated, checkFileAccess } = require('../middlewares/auth.js');

const filesRouter = Router();

filesRouter.use(isAuthenticated);

filesRouter.get('/:fileId/details', checkFileAccess, getFileDetails);
filesRouter.get('/:fileId', checkFileAccess, downloadFile);

filesRouter.post('/', upload.single('uploadfile'), uploadFile);

module.exports = filesRouter;