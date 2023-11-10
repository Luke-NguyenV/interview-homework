const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
// Hiển thị danh sách user
router.get('/', UserController.index);
// Hiển thị form tạo mới user
router.get('/create', UserController.create);
// Lưu form tạo user
router.post('/store', UserController.store);
// Hiển thị form chỉnh sửa user
router.get('/edit/:id', UserController.edit);
// Lưu form cập nhật user
router.post('/update', UserController.update);
// Xóa user
router.get('/destroy/:id', UserController.destroy);
module.exports = router;