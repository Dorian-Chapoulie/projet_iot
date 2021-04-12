const multer = require('multer');
const path = require('path');

const uploadFilter = (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if(ext !== '.bin') {
        return callback(new Error('Only .bin are allowed'));
    }
    callback(null, true)
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
  
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

exports.uploadFirmware = multer({ storage: storage, fileFilter: uploadFilter }).single('firmware');