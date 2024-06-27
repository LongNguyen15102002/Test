const express = require('express');
const appController = require('../controller/app.controller');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const uploadFolder = './uploads/';

if (!fs.existsSync(uploadFolder)){
    fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        if (ext !== '.xlsx' && ext !== '.xls') {
            return cb(new Error('Only .xlsx and .xls files are allowed'))
        }
        cb(null, true)
    }
});

router.post('/import-file', (req, res, next) => {
 try {
     fs.readdir(uploadFolder, (err, files) => {
         if (err) throw err;

         for (const file of files) {
             if (path.extname(file) === '.xlsx' || path.extname(file) === '.xls') {
                 fs.unlink(path.join(uploadFolder, file), err => {
                     if (err) throw err;
                 });
             }
         }
         next();
     });
 } catch (error) {
     console.log(error)
     throw new Error(error)
 }
}, (req, res, next) => {
    upload.single('file')(req, res, function (err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.send('File has been uploaded.')
    });
});

router.get('/get-info-user', appController.getInfoUser);

module.exports = router;

// File này định nghĩa các route cho ứng dụng sử dụng Express:
// Import các module cần thiết: express, multer, fs, path, và appController.
// Tạo thư mục uploadFolder nếu chưa tồn tại.
// Định nghĩa cấu hình lưu trữ cho multer để lưu file tải lên trong thư mục uploads.
// multer cũng có một bộ lọc để chỉ cho phép các file .xlsx và .xls.
// Định nghĩa route POST /import-file để xử lý tải lên file:
// Trước khi tải lên, xóa các file .xlsx và .xls cũ trong thư mục uploads.
// Sau đó, sử dụng multer để xử lý file tải lên.
// Định nghĩa route GET /get-info-user để lấy thông tin người dùng bằng getInfoUser từ app.controller.js.