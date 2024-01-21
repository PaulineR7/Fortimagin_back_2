const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => { 
        let name = req.body.title.toLowerCase() || file.originalname.split(' ').join('_');
        name = name.split('"').join('');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');