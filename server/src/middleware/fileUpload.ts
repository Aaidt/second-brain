import multer from "multer";
import path from "path";

const uploadPath = path.join(__dirname, "../../../tmp/uploads/")

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadPath);
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "-" + file.originalname);
    }
});

export const fileUpload = multer ({ storage });