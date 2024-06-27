const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

module.exports.readFile = async (req, res, username) => {
    if (!username.startsWith('@')) {
        username = '@' + username;
    }
    const urlFolder = path.join(__dirname, '../uploads');
    // Dòng "const urlFolder = path.join(__dirname, '../uploads');" tạo ra một đường dẫn tuyệt đối đến thư mục uploads bằng cách kết hợp đường dẫn
    // của thư mục hiện tại (được biểu thị bởi __dirname) với đường dẫn tương đối ../uploads.

    // Giải thích chi tiết:__dirname: Đây là một biến toàn cục trong Node.js, biểu thị đường dẫn tuyệt đối của thư mục chứa tệp hiện tại.
    // Ví dụ, nếu tệp read-file.service.js nằm trong thư mục /home/user/project/service, thì giá trị của __dirname sẽ là /home/user/project/service.
    
    // path.join: path là một module tích hợp sẵn trong Node.js, cung cấp các tiện ích để làm việc với đường dẫn tệp và thư mục.
    // path.join là một phương thức của module path, được sử dụng để kết hợp các đoạn đường dẫn lại với nhau theo cách đúng với hệ điều hành.
    // '../uploads': Đây là đường dẫn tương đối, biểu thị thư mục uploads nằm ở cấp cha của thư mục hiện tại. Dấu ../ có nghĩa là "lên một cấp thư mục".
    // Kết hợp lại:
    // path.join(__dirname, '../uploads') sẽ kết hợp đường dẫn của thư mục hiện tại với đường dẫn tương đối ../uploads.
    const file = fs.readdirSync(urlFolder).find(file => file.endsWith('.xlsx') || file.endsWith('.xls'));
    // Dòng "const file = fs.readdirSync(urlFolder).find(file => file.endsWith('.xlsx') || file.endsWith('.xls'));" có tác dụng tìm và trả về tên tệp
    // Excel đầu tiên có trong thư mục urlFolder.

    // Cụ thể, đây là những gì dòng mã này thực hiện:

    // 1. Đọc danh sách các tệp trong thư mục:
    // fs.readdirSync(urlFolder) sử dụng phương thức readdirSync của module fs (File System) để đọc đồng bộ nội dung của thư mục urlFolder.
    // Kết quả trả về là một mảng chứa tên tất cả các tệp trong thư mục đó.
    
    // 2. Tìm tệp Excel trong danh sách:
    // .find(file => file.endsWith('.xlsx') || file.endsWith('.xls')) áp dụng phương thức find trên mảng các tên tệp. Phương thức này sẽ duyệt qua
    // từng phần tử trong mảng và trả về phần tử đầu tiên thỏa mãn điều kiện được cung cấp.
    // Điều kiện ở đây là tên tệp phải kết thúc bằng .xlsx hoặc .xls, được kiểm tra bằng phương thức endsWith.
    
    if (!file) {
        res.send('No file found');
        return;
        //Trong NodeJS dùng return dể buộc code dừng luôn ko chạy đoạn code phía dưới
    }
    const urlFile = path.join(urlFolder, file);
    //Dòng "const urlFile = path.join(urlFolder, file);" dùng để kết hợp đường dẫn đến folder và tên file để mở file
    await readXlsxFile(urlFile).then((rows) => {
        let usernameIndex = -1;
        let usernameColumn = -1;
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                if (rows[i][j] === 'Username') {
                    usernameIndex = i;
                    usernameColumn = j;
                    break;
                }
            }
            if (usernameIndex !== -1) break;
        }
        // Khởi tạo usernameIndex và usernameColumn với giá trị -1 để biểu thị rằng chúng chưa được gán giá trị hợp lệ.
        // Lặp qua tất cả các hàng và cột để tìm cột chứa tiêu đề Username.
        // Nếu tìm thấy, gán usernameIndex bằng chỉ số hàng i và usernameColumn bằng chỉ số cột j.
        if (usernameIndex !== -1) {
            let rowObject;
            for (let i = usernameIndex + 1; i < rows.length; i++) {
                if (rows[i][usernameColumn] === null) continue;
                // Dòng "if (rows[i][usernameColumn] === null) continue;" trong mã JavaScript có nghĩa là: nếu giá trị tại hàng i và cột usernameColumn
                // trong mảng rows là null, thì bỏ qua phần còn lại của vòng lặp hiện tại và tiếp tục với lần lặp tiếp theo.
                if (!rows[i][usernameColumn].startsWith('@')) {
                    rows[i][usernameColumn] = '@' + rows[i][usernameColumn];
                }
                if (rows[i][usernameColumn] !== null) {
                    if (rows[i][usernameColumn].toLowerCase() === username.toLowerCase()) {
                        rowObject = rows[0].reduce((obj, key, index) => {
                            obj[key] = rows[i][index];
                            return obj;
                        }, {});
                        rowObject.verified = true;
                        const lowerCaseKeys = (obj) => {
                            return Object.entries(obj).reduce((newObj, [key, value]) => {
                                newObj[key.toLowerCase()] = value;
                                return newObj;
                            }, {});
                        }
                        rowObject = lowerCaseKeys(rowObject);
                        res.send({ data: rowObject, message: 'success' });
                    }
                }
            }
            if (!rowObject) {
                res.send('Unverified');
            }
        }
            // Nếu tìm thấy cột Username, lặp qua các hàng bên dưới tiêu đề để tìm giá trị username.
            // Nếu ô chứa username là null, bỏ qua hàng đó.
            // Nếu giá trị username trong hàng không bắt đầu bằng @, thêm @ vào đầu.
            // Nếu giá trị username trong hàng trùng với username đã yêu cầu, tạo đối tượng rowObject từ hàng đầu tiên (chứa tiêu đề) và hàng hiện tại (chứa giá trị), ánh xạ từng cột tiêu đề với giá trị tương ứng.
            // Đánh dấu người dùng này là verified (xác thực).
            // Định nghĩa hàm lowerCaseKeys để chuyển đổi tất cả các khóa của đối tượng thành chữ thường.
            // Chuyển đổi các khóa của rowObject thành chữ thường và gửi phản hồi với dữ liệu của người dùng và thông điệp 'success'.
            // Nếu không tìm thấy username, gửi phản hồi 'Unverified'.
    });
}

// File này chứa logic để đọc file Excel và tìm kiếm thông tin người dùng:
// Import các module read-excel-file, fs, path, và ExcelJS.
// Định nghĩa hàm readFile:
// Đảm bảo username bắt đầu bằng @.
// Tìm file .xlsx hoặc .xls trong thư mục uploads.
// Nếu không tìm thấy file, gửi phản hồi No file found.
// Đọc file Excel và tìm hàng chứa từ khóa Username.
// Tìm hàng có username trùng khớp và trả về dữ liệu của hàng đó.