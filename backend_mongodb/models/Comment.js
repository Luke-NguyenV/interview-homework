const db = require("./db");
const collection = db.collection("comments");
class Comment {
  // hàm xây dựng đối tượng
  constructor(id, owner, post, content) {
    this.id = id;
    this.owner = owner;
    this.post = post;
    this.content = content;
    this.created_at = 1576506719083;
  }

  static all = async (page = null, item_per_page = null) => {
    try {
      // Xây dựng phân trang
      let rows = [];
      if (page && item_per_page) {
        item_per_page = Number(item_per_page);
        const skip_number = (page - 1) * item_per_page;
        rows = await collection
          .find()
          .skip(skip_number)
          .limit(item_per_page)
          .toArray();
      } else {
        rows = await collection.find().toArray();
      }

      return this.convertArrayToObjects(rows);
    } catch (error) {
      throw new Error(error);
    }
  };

  static convertArrayToObjects = (rows) => {
    const comments = rows.map(
      (row) => new Comment(row.id, row.owner, row.post, row.content)
    );
    return comments;
  };

  static all = async (page = null, item_per_page = null) => {
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "id",
          foreignField: "owner",
          as: "user_info",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "id",
          foreignField: "post",
          as: "post_info",
        },
      },
      {
        $project: {
          _id: 0,
          comment_id: 1,
          owner: 1,
          post: 1,
          content: ""
        },
      },
    ];
    try {
      // Xây dựng phân trang
      let rows = [];
      if (page && item_per_page) {
        item_per_page = Number(item_per_page);
        const skip_number = (page - 1) * item_per_page;
        rows = await collection
          .aggregate(pipeline)
          .skip(skip_number)
          .limit(item_per_page)
          .toArray();
      } else {
        rows = await collection.aggregate(pipeline).toArray();
      }

      return this.convertArrayToObjects(rows);
    } catch (error) {
      throw new Error(error);
    }
  };

  static save = async (data) => {
    try {
      const row = await collection.findOne({}, { sort: { id: -1 } });
      const newInsertId = row ? row.id + 1 : 1;

      await collection.insertOne({
        id: newInsertId,
        owner: Number(data.owner),
        post: Number(data.post),
      });
      return newInsertId;
    } catch (error) {
      throw new Error(error);
    }
  };

  // Tìm 1 dòng
  static find = async (id) => {
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "id",
          foreignField: "owner",
          as: "user_info",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "id",
          foreignField: "post",
          as: "post_info",
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          owner: 1,
          post: 1,
          content: ""
        },
      },
      {
        $match: {
          id: Number(id),
        },
      },
    ];
    try {
      const rows = await collection.aggregate(pipeline).toArray();
      // check nếu không có dòng nào thỏa mãn trong bảng comment
      if (rows.length == 0) {
        return null;
      }
      console.log(rows);
      const comments = this.convertArrayToObjects(rows);
      const comment = comments[0];
      return comment;
    } catch (error) {
      throw new Error(error);
    }
  };

  update = async () => {
    try {
      const query = { id: this.id };
      const set = {
        $set: {
          content: this.content,
        },
      };
      await collection.updateOne(query, set);

      return true;
    } catch (error) {
      throw new Error(error);
    }
  };

  destroy = async () => {
    try {
      const query = { id: this.id };
      await collection.deleteOne(query);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  };

  static getByUserId = async (
    id,
    page = null,
    item_per_page = null
  ) => {
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "id",
          foreignField: "owner",
          as: "user_info",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "id",
          foreignField: "post",
          as: "subject_info",
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          owner: 1,
          post: 1,
          content: ""
        },
      },
      {
        $match: { id: Number(id) },
      },
    ];

    try {
      // Xây dựng phân trang
      let rows = [];
      if (page && item_per_page) {
        item_per_page = Number(item_per_page);
        const skip_number = (page - 1) * item_per_page;
        rows = await collection
          .aggregate(pipeline)
          .skip(skip_number)
          .limit(item_per_page)
          .toArray();
      } else {
        rows = await collection.aggregate(pipeline).toArray();
      }

      return this.convertArrayToObjects(rows);
    } catch (error) {
      throw new Error(error);
    }
  };

  static getByPostId = async (
    id,
    page = null,
    item_per_page = null
  ) => {
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "id",
          foreignField: "owner",
          as: "user_info",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "id",
          foreignField: "post",
          as: "post_info",
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          owner: 1,
          post: 1,
         content: ""
        },
      },
      {
        $match: { id: Number(id) },
      },
    ];

    try {
      // Xây dựng phân trang
      let rows = [];
      if (page && item_per_page) {
        item_per_page = Number(item_per_page);
        const skip_number = (page - 1) * item_per_page;
        rows = await collection
          .aggregate(pipeline)
          .skip(skip_number)
          .limit(item_per_page)
          .toArray();
      } else {
        rows = await collection.aggregate(pipeline).toArray();
      }

      return this.convertArrayToObjects(rows);
    } catch (error) {
      throw new Error(error);
    }
  }; 
}
module.exports = Comment;
