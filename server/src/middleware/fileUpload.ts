import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(__dirname, "../../../tmp/uploads/")

if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploadPath);
    },
    filename: function(req, file, cb){
        const originalname = file.originalname
        const timeStamp = Date.now()
        const newFilename = `${timeStamp}-${originalname}` 

        const filePath = path.join(uploadPath, newFilename)
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if(err){
                cb(null, newFilename);
            }else{
                cb(new Error("File already exists."), "")
            }
        })
    }
});

export const fileUpload = multer ({ storage });