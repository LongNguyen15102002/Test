const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const routes = require('./routes/app.routes');

app.use('/api', routes);
app.listen(PORT)

// File chính để khởi tạo và chạy ứng dụng:
// Import và khởi tạo ứng dụng Express.
// Sử dụng dotenv để nạp biến môi trường từ file .env.
// Cấu hình ứng dụng để xử lý JSON và URL-encoded data.
// Import và sử dụng các route được định nghĩa trong app.routes.js.
// Khởi chạy server tại cổng được chỉ định bởi biến môi trường PORT hoặc 3001.