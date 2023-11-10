const postModel = require("../models/Post");
const registerModel = require("../models/Register");
const { format } = require("date-fns");
class PostController {
  static module = "post";
  // Hàm hiển thị danh sách môn học
  static index = async (req, res) => {
    try {
      const search = req.query.search;
      const page = req.query.page || 1;
      const item_per_page = process.env.ITEM_PER_PAGE;
      
      let posts = [];
      let totalPosts = [];
      if (search) {
        posts = await postModel.getByPattern(search, page, item_per_page);
        totalPosts = await postModel.getByPattern(search);
      } else {
        posts = await postModel.all(page, item_per_page);
        totalPosts = await postModel.all();
      }

      const totalPage = Math.ceil(totalPosts.length / item_per_page);

      const message_success = "Sucessfully";
      return {
        posts: posts,
        search: search,
        message_success: message_success,
        totalPage: totalPage,
        page: page
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
      await postModel.save(req.body);
      const message_success = `Đã tạo bản tin ${req.body.name} thành công`;
      return {message_success};
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static edit = async (req, res) => {
    const post = await postModel.find(req.params.id);
    try {
      return {post};
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static update = async (req, res) => {
    try {
      const id = req.body.id;
      const title = req.body.title;
      const content = req.body.content;
      const post = await postModel.find(id);
      post.title = title;
      post.content = content;

      await post.update();
      const message_success = `Đã cập nhật bản tin ${req.body.name} thành công`;
      return {message_success};
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static destroy = async (req, res) => {
    try {
      const post = await postModel.find(req.params.id);
      await post.destroy();
      const message_success = `Đã xóa bản tin ${post.name} thành công`;
      return {message_success};
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}
module.exports = PostController;
