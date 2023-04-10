import { Router } from "express";
import {
  findById,
  getAll,
  insert,
  remove,
  update,
} from "../controllers/parts.controller.js";

const partsRoute = Router();

partsRoute.get("/", getAll);
partsRoute.get("/:id", findById);
partsRoute.post("/", insert);
partsRoute.put("/:id", update);
partsRoute.delete("/:id", remove);

export default partsRoute;
