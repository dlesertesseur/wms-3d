import partsSchema from "../models/parts.model.js";
import Dao from "./dao.js";
import mongoose from "mongoose";
import { DB_NAME, MONGO_DB_CONNECTION } from "../config/config.js";

class PartsDao extends Dao {
  constructor() {
    mongoose.set("strictQuery", false);
    mongoose.connect(MONGO_DB_CONNECTION, { dbName: DB_NAME });
    const collection = mongoose.model("parts", partsSchema);
    super(collection);
  }
}

export default PartsDao;
