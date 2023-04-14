import mongoose from "mongoose";
import structuresSchema from "../models/structures.model.js";
import Dao from "./dao.js";
import { DB_NAME, MONGO_DB_CONNECTION } from "../config/config.js";

class StructuresDao extends Dao {
  constructor() {
    mongoose.set("strictQuery", false);
    mongoose.connect(MONGO_DB_CONNECTION, { dbName: DB_NAME });
    const collection = mongoose.model("structures", structuresSchema);
    super(collection);
  }

  async update(id, body) {
    try {
      const ret = await this.collection.updateOne({ _id: id }, body);
      return ret;
    } catch (error) {
      throw error;
    }
  }
}

export default StructuresDao;
