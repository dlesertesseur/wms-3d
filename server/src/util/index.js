import fs from "fs";
import ActorsDao from "../persistence/actors.dao.js";

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
  const actors = await getObjects("./data/actors.json");

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

//insertActorsFromJson().catch((err) => console.log(err));
insertPartsFromJson().catch((err) => console.log(err));
