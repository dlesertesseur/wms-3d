import ActorsDao from "../persistence/actors.dao.js";
import Service from "./service.js";

class ActorsService extends Service {
  constructor() {
    super(new ActorsDao());
  }
}

export default ActorsService;
