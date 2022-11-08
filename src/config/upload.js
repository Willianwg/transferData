const multer = require('multer');
const path = require('path');
const isSupported  = require('../extensions/supported');

module.exports = {
    storage:multer.diskStorage({

        destination:path.resolve(__dirname, '..','..','images'),
        filename:(req,file,callback)=>{
            const extension = path.extname(file.originalname);
            const name = path.basename(file.originalname,extension);

            callback(null, `${name}-${Date.now()}${extension}`);
        }
    }),

    fileFilter:(req,file,callback)=>{
        const { mimetype } = file;
        const valid = isSupported(mimetype);

        callback(null, valid);
    },

    limits:{
        fileSize:20 * 1000000
    }
}