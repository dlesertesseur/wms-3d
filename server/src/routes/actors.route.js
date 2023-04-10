import { Router } from "express";
import {
  findById,
  getAll,
  insert,
  remove,
  update,
} from "../controllers/actors.controller.js";

const actorsRoute = new Router();

actorsRoute.get("/", getAll);
actorsRoute.get("/:id", findById);
actorsRoute.post("/", insert);
actorsRoute.put("/:id", update);
actorsRoute.delete("/:id", remove);

export default actorsRoute;
