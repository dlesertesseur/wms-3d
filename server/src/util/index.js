import fs from "fs";
import ActorsDao from "../persistence/actors.dao.js";
import StructuresDao from "../persistence/structures.dao.js";

const getObjects = async (path) => {
  let arr = [];
  const ret = await fs.promises.readFile(path, "utf-8");
  arr = JSON.parse(ret);
  return arr;
};

const logTitle = async (title) => {
  console.log(`<----------> ${title} <---------->`);
};

const log = async (data) => {
  console.log(data);
};

async function insertActorsFromJson() {
  const actorsDao = new ActorsDao();

  logTitle("get actors from file");
  const actors = await getObjects("./data/cd_actors.json");

  logTitle("insert actors to DDBB " + actors.length + " rows");
  for (let i = 0; i < actors.length; i++) {
    const ret = await actorsDao.insert(actors[i]);
    log(`row: ${i} actor: ${ret.name}`);
  }
  logTitle("Fin");
}

function groupParts(parts) {
  const group = {};
  for (let i = 0; i < parts.length; i++) {
    const ret = parts[i];

    if (!group[ret.structure_code.toString()]) {
      group[ret.structure_code.toString()] = [];
    }

    group[ret.structure_code.toString()].push(ret);
  }
  return(group);
}

async function insertPartsFromJson() {
  logTitle("Start process -> insertPartsFromJson");

  const actorsDao = new ActorsDao();
  const parts = await getObjects("./data/parts.json");
  logTitle("Read parts from Json " + parts.length + " rows");

  const groups = groupParts(parts); 
  logTitle("Parts group by structure_code. groups: " + Object.keys(groups).length);

  const actors = await actorsDao.getAll()
  logTitle("Get all actors from mongo. rows: " + actors.length);

  for (let i = 0; i < actors.length; i++) {
    const actor = actors[i];
    const parts = groups[actor.structure_code.toString()];

    const newActor = {...actor};
    newActor.parts = parts;
    delete newActor._id;

    await actorsDao.update(actor._id, newActor)
    log(`actor ${actor.name} updated parts: ${newActor.parts.length}`);
  }

  logTitle("End process -> insertPartsFromJson");
}

async function insertStructuresFromJson() {
  const dao = new StructuresDao();

  logTitle("get structures from file");
  const structures = await getObjects("./data/cd_actors.json");

  logTitle("insert structures to DDBB " + structures.length + " rows");
  for (let i = 0; i < structures.length; i++) {
    const ret = await dao.insert(structures[i]);
    log(`row: ${i} actor: ${ret.name}`);
  }
  logTitle("Fin");
}


async function insertPartsOfStructureFromJson() {
  logTitle("Start process -> insertPartsOfStructureFromJson");

  const dao = new StructuresDao();
  const parts = await getObjects("./data/cd_structures.json");
  logTitle("Read structure parts from Json " + parts.length + " rows");

  const groups = groupParts(parts); 
  logTitle("Parts group by structure_code. groups: " + Object.keys(groups).length);

  const structures = await dao.getAll()
  logTitle("Get all structures from mongo. rows: " + structures.length);

  for (let i = 0; i < structures.length; i++) {
    const structure = structures[i];
    const parts = groups[structure.structure_code.toString()];

    const newStructure = {...structure};
    newStructure.parts = parts;
    delete newStructure._id;

    await dao.update(structure._id, newStructure)
    log(`actor ${structure.name} updated parts: ${newStructure.parts.length}`);
  }

  logTitle("End process -> insertPartsOfStructureFromJson");
}

async function updateStructuresFromJson() {
  logTitle("Start process -> updateStructuresFromJson");

  const stcMap = new Map();
  const dao = new StructuresDao();
  const structuresFromJson = await getObjects("./data/cd_actors.json");
  logTitle("Read structure parts from Json " + structuresFromJson.length + " rows");

  structuresFromJson.forEach(stc => {
    stcMap.set(stc.code.toString(), stc);
  });

  const structures = await dao.getAll()
  logTitle("Get all structures from mongo. rows: " + structures.length);

  for (let i = 0; i < structures.length; i++) {
    const structure = structures[i];
    const stcFromJson = stcMap.get(structure.code);
    if(stcFromJson){
      const newStructure = {...structure};
      newStructure.dim_x = stcFromJson.dim_x,
      newStructure.dim_y = stcFromJson.dim_y,
      newStructure.dim_z = stcFromJson.dim_z,
      delete newStructure._id;
  
      await dao.update(structure._id, newStructure)
      log(`actor ${structure.name} updated`);
    }else{
      log(`actor ${structure.name} NOT FOUND`);
    }
  }

  logTitle("End process -> updateStructuresFromJson");
}


//insertStructuresFromJson().catch((err) => console.log(err));
//insertPartsOfStructureFromJson().catch((err) => console.log(err));
//updateStructuresFromJson().catch((err) => console.log(err));

