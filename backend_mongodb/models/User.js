const db = require("./db");
const collection = db.collection("users");
class User {
  // hàm xây dựng đối tượng
  constructor(id, username, password, name, dob) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
    this.dob = dob;
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
    const users = rows.map(
      (row) => new User(row.id, row.username, row.password, row.name, row.dob)
    );
    return users;
  };

  static getByPattern = async (search, page = null, item_per_page = null) => {
    try {
      // Xây dựng phân trang

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

      // db.collection.find({name: {$regex: /^Dan$/}})
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
        name: data.name,
        dob: data.dob,
        gender: data.gender,
      });
      
      return newInsertId;
    } catch (error) {
      throw new Error(error);
    }
  };

  // Tìm 1 dòng user
  static find = async (id) => {
    try {
      const query = { id: Number(id) };
      const row = await collection.findOne(query);
      // check nếu không có dòng nào thỏa mãn trong bảng user
      if (!row) {
        return null;
      }
      const rows = [row];
      const users = this.convertArrayToObjects(rows);
      const user = users[0];
      return user;
    } catch (error) {
      throw new Error(error);
    }
  };

  update = async () => {
    try {
      const query = { id: this.id };
      const set = {
        $set: { name: this.name, dob: this.dob, gender: this.gender },
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
}
module.exports = User;
