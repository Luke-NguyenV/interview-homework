const db = require("./db");
const collection = db.collection("posts");
class Post {
  constructor(id, name, number_of_credit) {
    this.id = id;
    this.name = name;
    this.number_of_credit = number_of_credit;
  }

  static all = async (page = null, item_per_page = null) => {
    try {
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
    const posts = rows.map(
      (row) => new Post(row.post_id, row.name, row.number_of_credit)
    );
    return posts;
  };

  static getByPattern = async (search, page = null, item_per_page = null) => {
    try {
      let rows = [];
      const query = { name: { $regex: search, $options: "i" } };
      if (page && item_per_page) {
        item_per_page = Number(item_per_page);
        const skip_number = (page - 1) * item_per_page;
        rows = await collection
          .find(query)
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

  static save = async (data) => {
    try {
      const row = await collection.findOne({}, { sort: { id: -1 } });
      const newInsertId = row ? row.post_id + 1 : 1;

      await collection.insertOne({
        id: newInsertId,
        title: data.title,
        content: data.content,
      });
      return newInsertId;
    } catch (error) {
      throw new Error(error);
    }
  };

  // Tìm 1 dòng post
  static find = async (id) => {
    try {
      const query = { id: Number(id) };
      const row = await collection.findOne(query);
      
      if (!row) {
        return null;
      }
      const rows = [row];
      const posts = this.convertArrayToObjects(rows);
      const post = posts[0];
      return post;
    } catch (error) {
      throw new Error(error);
    }
  };

  update = async () => {
    try {
      const query = { post_id: this.id };
      const set = {
        $set: { title: this.title, content: this.content },
      };
      await collection.updateOne(query, set);

      return true;
    } catch (error) {
      throw new Error(error);
    }
  };

  destroy = async () => {
    try {
      const query = { post_id: this.id };
      await collection.deleteOne(query);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  };
}
module.exports = Post;
