import StructuresDao from "../persistence/structures.dao.js";
import Service from "./service.js";

class StructuresService extends Service {
  constructor() {
    super(new StructuresDao());
  }
}

export default StructuresService;
