const readFile = require('../service/read-file.service');

module.exports.getInfoUser = async (req, res) => {
    const username = req.query.username;
    return await readFile.readFile(req,res, username)
}

//Đoạn mã này định nghĩa một controller để xử lý yêu cầu nhận thông tin người dùng:
// readFile được import từ read-file.service.js.
// getInfoUser là một hàm bất đồng bộ, nhận vào req và res.
// Hàm này lấy username từ query của yêu cầu HTTP (req.query.username).
// Sau đó gọi hàm readFile từ read-file.service.js với các tham số req, res, và username.