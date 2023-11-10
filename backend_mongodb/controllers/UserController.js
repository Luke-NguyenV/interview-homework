const userModel = require("../models/User");
const commentModel = require("../models/Comment");
const { format } = require("date-fns");
class UserController {
  static module = "user";
  // Hàm hiển thị danh sách sinh viên
  static index = async (req, res) => {
    try {
      const search = req.query.search;
      const page = Number(req.query.page || 1);
      const item_per_page = process.env.ITEM_PER_PAGE;
      
      let users = [];
      let totalUsers = [];
      if (search) {
        users = await userModel.getByPattern(search, page, item_per_page);  
        totalUsers = await userModel.getByPattern(search);
      } else {
        users = await userModel.all(page, item_per_page);      
        totalUsers = await userModel.all();
      }
      const totalPage = Math.ceil(totalUsers.length / item_per_page);
      const message_success = "Sucessfully";

      return {
        users: users,
        search: search,
        message_success: message_success,
        totalPage: totalPage,
        page: page,
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static create = (req, res) => {
    try {
      return;
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static store = async (req, res) => {
    try {
      await userModel.save(req.body);

      const message_success = `Đã tạo sinh viên ${req.body.name} thành công`;
      return {message_success};
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static edit = async (req, res) => {
    const user = await userModel.find(req.params.id);
    try {
      return {user};
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static update = async (req, res) => {
    try {
      const id = req.body.id;
      const username = req.body.username;
      const password = req.body.password;
      const name = req.body.name;
      const dob = req.body.dob;

      const user = await userModel.find(id);

      user.name = name;
      user.dob = dob;
      user.password = password;

      await user.update();
      const message_success = `Đã cập nhật người dùng ${username} thành công`;
      return {message_success};
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static destroy = async (req, res) => {
    try {
      const user = await userModel.find(req.params.id);

      const comments = await commentModel.getByUserId(req.params.id);
      let message_error;
      if (comments.length > 0) {
        message_error = `Người dùng ${user.username} đã bình luận ${comments.length} ý kiến, không thể xóa`;
        return;
      }

      await user.destroy();
      message_success = `Đã xóa người dùng ${user.username} thành công`;
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}
module.exports = UserController;
