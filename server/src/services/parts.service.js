import PartsDao from "../persistence/parts.dao.js";
import Service from "./service.js";

class PartsService extends Service {
  constructor() {
    super(new PartsDao());
  }
}

export default PartsService;
