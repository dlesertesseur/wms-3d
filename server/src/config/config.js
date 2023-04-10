import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.HTTP_PORT || 8080;
const MONGO_DB_CONNECTION = process.env.MONGO_DB_CONNECTION;
const DB_NAME = process.env.DB_NAME;

export {PORT, MONGO_DB_CONNECTION, DB_NAME}