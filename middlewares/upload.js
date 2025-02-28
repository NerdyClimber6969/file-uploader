const multer = require('multer');
const fs = require('node:fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const { username } = req.user;
        const destination = `./storage/${username}/`;
        return cb(null, destination);
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        return cb(null, `${crypto.randomUUID()}.${ext}`);
    },
});

const upload = multer({storage: storage});

module.exports = upload;