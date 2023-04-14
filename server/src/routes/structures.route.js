import { Router } from "express";
import {
  findById,
  getAll,
  insert,
  remove,
  update,
} from "../controllers/structures.controller.js";

const structuresRoute = new Router();

structuresRoute.get("/", getAll);
structuresRoute.get("/:id", findById);
structuresRoute.post("/", insert);
structuresRoute.put("/:id", update);
structuresRoute.delete("/:id", remove);

export default structuresRoute;
