const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
// Hiển thị danh sách post
router.get('/', PostController.index);
// Hiển thị form tạo mới post
router.get('/create', PostController.create);
// Lưu form tạo post
router.post('/store', PostController.store);
// Hiển thị form chỉnh sửa post
router.get('/edit/:id', PostController.edit);
// Lưu form cập nhật post
router.post('/update', PostController.update);
// Xóa post
router.get('/destroy/:id', PostController.destroy);
module.exports = router;