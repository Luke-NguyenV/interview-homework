const commentModel = require("../models/Comment");
const commentModel = require("../models/Student");
const postModel = require("../models/Subject");
const { format } = require("date-fns");
class CommentController {
  static module = "comment";
  static index = async (req, res) => {
    try {
      const search = req.query.search;
      const page = req.query.page || 1;
      const item_per_page = process.env.ITEM_PER_PAGE;
  
      let comments = [];
      let totalComments = [];
      if (search) {
        comments = await commentModel.getByPattern(
          search,
          page,
          item_per_page
        );
        totalComments = await commentModel.getByPattern(search);
      } else {
        comments = await commentModel.all(page, item_per_page);
        totalComments = await commentModel.all();
      }

      const totalPage = Math.ceil(totalComments.length / item_per_page);
      const message_success = "Get success";
      return {
        comments: comments,
        search: search,
        message_success: message_success,
        totalPage: totalPage,
        page: page,
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static create = async (req, res) => {
    try {
      const users = await userModel.all();
      const posts = await postModel.all();
      return {
        users: users,
        posts: posts,
      };
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static store = async (req, res) => {
    try {
      await commentModel.save(req.body);

      const comment = await commentModel.find(req.body.comment_id);
      const comment_name = comment.name;

      const post = await postModel.find(req.body.post_id);
      const post_name = post.name;

      const message_success = `${comment_name} lưu trong bài viết ${post_name} thành công`;
      return {message_success};
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static edit = async (req, res) => {
    const comment = await commentModel.find(req.params.id);
    // aaa
    try {
      return {
        comment: comment,
      };
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static update = async (req, res) => {
    try {
      const id = req.body.id;
      const content = req.body.content;
      const comment = await commentModel.find(id);
      comment.content = content;
      await comment.update();
   
      const comment_name = comment.comment_name;
      const post_name = comment.post_name;
     
      const message_success = `Người dùng ${comment_name} đã cập nhật bài viết ${post_name}`;
     
      return {message_success};
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  static destroy = async (req, res) => {
    try {
      const comment = await commentModel.find(req.params.id);
      await comment.destroy();

      const message_success = `Người dùng ${comment.comment_name} hủy bài viết ${comment.post_name}`;
      return {message_success};
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}
module.exports = CommentController;
