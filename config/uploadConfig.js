const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine upload directory based on the file fieldname
        let uploadPath = '';

        if (file.fieldname === 'noteFile') {
            uploadPath = 'uploads/notes/';
        } else if (file.fieldname === 'profilePicture') {
            uploadPath = 'uploads/user/';
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 * 30 }, // 30MB file limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([
    { name: 'noteFile', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
]);

// Check file type
function checkFileType(file, cb) {
    const filetypes = /pdf|jpg|jpeg|png|pptx|doc|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Files of this type are not allowed!');
    }
}

module.exports = upload;
