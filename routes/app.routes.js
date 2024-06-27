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

// 1. fs.existsSync(uploadFolder):

// fs là module tích hợp sẵn trong Node.js để làm việc với hệ thống tệp.
// existsSync là một phương thức của module fs được sử dụng để kiểm tra xem một đường dẫn (tệp hoặc thư mục) có tồn tại hay không.
// Phương thức này đồng bộ, nghĩa là nó sẽ chặn tiến trình cho đến khi hoàn thành kiểm tra.
// uploadFolder là biến chứa đường dẫn đến thư mục uploads.

// 2. !fs.existsSync(uploadFolder):

// Dấu ! là toán tử phủ định, nghĩa là kiểm tra điều kiện ngược lại.
// Nếu thư mục uploadFolder không tồn tại, điều kiện này sẽ trả về true.
// fs.mkdirSync(uploadFolder):

// 3. mkdirSync là một phương thức của module fs được sử dụng để tạo thư mục mới. Phương thức này cũng là đồng bộ, nghĩa là nó sẽ chặn tiến trình
// cho đến khi hoàn thành việc tạo thư mục.
// Nếu điều kiện if là true (tức là thư mục uploadFolder không tồn tại), thì dòng lệnh này sẽ được thực thi để tạo ra thư mục uploads.

// => Ý nghĩa: Đảm bảo rằng thư mục uploads tồn tại trước khi ứng dụng cố gắng lưu trữ bất kỳ tệp nào vào đó.
// Tránh các lỗi có thể xảy ra khi ứng dụng cố gắng lưu tệp vào một thư mục không tồn tại.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
// 1. multer.diskStorage:
// Đây là một phương thức của multer để cấu hình cách thức lưu trữ tệp trên đĩa.
// Nó nhận một đối tượng với hai thuộc tính: destination và filename.

// 2. destination: function (req, file, cb):
// Thuộc tính destination xác định thư mục nơi các tệp sẽ được lưu trữ.
// Đây là một hàm nhận ba tham số: req (yêu cầu HTTP), file (đối tượng tệp đang được xử lý), và cb (callback).
// cb(null, uploadFolder) gọi callback với hai tham số: null (không có lỗi) và uploadFolder (đường dẫn đến thư mục lưu trữ).

// 3. filename: function (req, file, cb):
// Thuộc tính filename xác định tên tệp sẽ được lưu trữ trên đĩa.
// Đây là một hàm nhận ba tham số: req (yêu cầu HTTP), file (đối tượng tệp đang được xử lý), và cb (callback).
// cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) gọi callback với hai tham số: null (không có lỗi) và một chuỗi
// đại diện cho tên tệp mới.
// file.fieldname: tên trường của tệp trong form dữ liệu (ví dụ: 'file' nếu input name là file).
// Date.now(): thời gian hiện tại dưới dạng số milliseconds từ Epoch (01/01/1970).
// path.extname(file.originalname): phần mở rộng của tệp gốc (ví dụ: '.xlsx' hoặc '.xls').

// => Ý nghĩa:
// 1. destination: Đảm bảo rằng tất cả các tệp được tải lên sẽ được lưu vào thư mục uploads.
// 2. filename: Đảm bảo rằng mỗi tệp được lưu trữ có một tên duy nhất bằng cách kết hợp tên trường tệp, thời gian hiện tại và phần mở rộng của tệp gốc.
// Điều này giúp tránh ghi đè các tệp có cùng tên và giữ lại phần mở rộng gốc của tệp để xác định loại tệp.

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

// 1. storage: storage:
// storage: Đây là cấu hình lưu trữ đã được định nghĩa trước đó bằng multer.diskStorage.
// storage xác định cách và nơi mà các tệp tải lên sẽ được lưu trữ.

// 2. fileFilter: function (req, file, cb):
// fileFilter: Đây là một hàm dùng để lọc các tệp tải lên dựa trên loại tệp.
// Hàm này nhận ba tham số:
    // req: Đối tượng yêu cầu HTTP.
    // file: Đối tượng tệp đang được tải lên.
    // cb: Callback để chỉ định tiếp theo trong quá trình xử lý.

// 3. const ext = path.extname(file.originalname);:
// path.extname(file.originalname): Lấy phần mở rộng của tệp từ tên tệp gốc.
// ext lưu trữ phần mở rộng này để sử dụng trong điều kiện kiểm tra sau.

// 4. if (ext !== '.xlsx' && ext !== '.xls') { return cb(new Error('Only .xlsx and .xls files are allowed')) }:
// Kiểm tra nếu phần mở rộng tệp không phải là .xlsx hoặc .xls.
// Nếu tệp không phù hợp, gọi cb với một đối tượng lỗi mới chứa thông báo "Only .xlsx and .xls files are allowed".

// 5. cb(null, true):
// Nếu phần mở rộng tệp là hợp lệ, gọi cb với null (không có lỗi) và true (cho phép tệp này).
// Mục đích:
// 1. Lưu trữ:
    // Đảm bảo các tệp tải lên được lưu trữ theo cấu hình định nghĩa trước đó.
// 2. Bộ lọc tệp:
        // Chỉ cho phép tải lên các tệp có phần mở rộng .xlsx và .xls.
        // Ngăn chặn các tệp không hợp lệ bằng cách trả về một lỗi nếu phần mở rộng tệp không phù hợp.

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

// Phần 1: Xóa các tệp cũ trong thư mục uploads
// 1. router.post('/import-file', (req, res, next) => {:Định nghĩa một tuyến đường (route) POST cho endpoint /import-file.
// 2. try {: Bắt đầu một khối try để xử lý lỗi có thể xảy ra trong quá trình đọc và xóa tệp.
// 3. fs.readdir(uploadFolder, (err, files) => {:
    // fs.readdir đọc nội dung của thư mục uploadFolder.
    // uploadFolder là đường dẫn tới thư mục uploads.
// 4. if (err) throw err;: Nếu có lỗi trong quá trình đọc thư mục, ném lỗi ra để dừng việc thực thi.
// 5. for (const file of files) {: Lặp qua từng tệp trong thư mục.
// 6. if (path.extname(file) === '.xlsx' || path.extname(file) === '.xls') {: Kiểm tra nếu tệp có phần mở rộng là .xlsx hoặc .xls.
// 7. fs.unlink(path.join(uploadFolder, file), err => {:
    // fs.unlink xóa tệp được chỉ định.
    // path.join(uploadFolder, file) tạo ra đường dẫn đầy đủ tới tệp cần xóa.
// 8. if (err) throw err;: Nếu có lỗi trong quá trình xóa tệp, ném lỗi ra để dừng việc thực thi.
// 9. next();: Gọi next() để chuyển sang middleware tiếp theo sau khi hoàn thành việc xóa tệp.

// Phần 2: Xử lý việc tải lên tệp mới
// 1. (req, res, next) => {: Middleware tiếp theo trong tuyến đường.
// 2. upload.single('file')(req, res, function (err) {: Sử dụng multer để xử lý việc tải lên tệp với tên trường là file.

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