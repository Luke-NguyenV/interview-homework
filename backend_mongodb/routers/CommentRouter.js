const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
// Hiển thị danh sách comment
router.get('/', CommentController.index);
// Hiển thị form tạo mới comment
router.get('/create', CommentController.create);
// Lưu form tạo comment
router.comment('/store', CommentController.store);
// Hiển thị form chỉnh sửa comment
router.get('/edit/:id', CommentController.edit);
// Lưu form cập nhật comment
router.comment('/update', CommentController.update);
// Xóa comment
router.get('/destroy/:id', CommentController.destroy);
module.exports = router;