import * as THREE from "three";
import {
  BASE_LOD_LEVEL,
  PIXEL_METER_RELATION,
  SCALE,
  URL_SERVER,
} from "./config";

const matBase = new THREE.MeshLambertMaterial({ color: 0xced4da });
const matShelf = new THREE.MeshLambertMaterial({ color: 0x0000ee });
const matStructure = new THREE.MeshLambertMaterial({ color: 0x868e96 });
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const meshTable = {};

const materials = {
  ESTANTE: matShelf,
  BASE: matBase,
  BACK: matStructure,
  LEFT: matStructure,
  RIGHT: matStructure,
  INTERNAL: matStructure,
  VISUALITY: matStructure,
  VISUAL: matStructure,
};

function buildStructures(scene, structures, excludeParts) {
  const count = structures.length;
  for (let i = 0; i < count; i++) {
    const structure = structures[i];
    buildStructure(scene, structure, excludeParts);
  }
}

function drawCenter(scene) {
  const geometry = new THREE.BoxGeometry(1 * SCALE, 1 * SCALE, 1 * SCALE);
  geometry.translate(0, 1, 0);
  const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

function processPartName(partPrefix, excludePartsPredix) {
  let ret = true;

  if (excludePartsPredix) {
    ret = !excludePartsPredix.includes(partPrefix);
  }
  return ret;
}

function getLogLevel(partPrefix) {
  let ret = BASE_LOD_LEVEL;

  switch (partPrefix) {
    case "BASE":
      ret = BASE_LOD_LEVEL * 3;
      break;
    case "BACK":
      ret = BASE_LOD_LEVEL * 2;
      break;
    case "ESTANTE":
    case "LEFT":
    case "RIGHT":
    case "INTERNAL":
    case "VISUALITY":
    case "VISUAL":
      ret = BASE_LOD_LEVEL;
      break;
  }
  return ret;
}

function createMesh(partPrefix, part) {

  const mat = materials[partPrefix];
  if (!mat) {
    console.log(part.name);
  }
  
  const geometry = new THREE.BoxGeometry(
    part.dim_x * SCALE,
    part.dim_y * SCALE,
    part.dim_z * SCALE
  );

  const grPart = new THREE.Mesh(geometry, mat ? mat : material);

  grPart.name = part.name;
  grPart.position.x = part.pos_x * SCALE;
  grPart.position.y = part.pos_y * SCALE;
  grPart.position.z = part.pos_z * SCALE;
  grPart.updateMatrix();
  grPart.matrixAutoUpdate = false;

  return grPart;
}

function buildStructure(scene, structure, exclude = null) {
  const parts = structure.parts;
  const grStructure = new THREE.Group();

  grStructure.name = structure.name;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const partPrefix = part.name.split(" ")[0];
    const processPart = processPartName(partPrefix, exclude);
    
    if (processPart) {
      const grPart = createMesh(partPrefix, part);
      grStructure.add(grPart);
    }
  }

  grStructure.position.x = structure.pos_x * PIXEL_METER_RELATION;
  grStructure.position.y = structure.pos_y * PIXEL_METER_RELATION;
  grStructure.position.z = structure.pos_z * PIXEL_METER_RELATION;
  grStructure.rotateY((structure.rot * 3.14) / 180);

  scene.add(grStructure);
}

async function createWorld(scene) {
  const url = URL_SERVER + "/actors";
  const options = {
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };

  try {
    const response = await fetch(url, options);
    const jsonData = await response.json();
    buildStructures(scene, jsonData);
  } catch (error) {
    alert(error);
  }
}

async function createSimpleWorld(scene) {
  const url = URL_SERVER + "/actors/643075e4f7d3caa7568bf669";
  const options = {
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  const response = await fetch(url, options);
  const jsonData = await response.json();

  console.log(jsonData);
  drawCenter(scene);

  const position = { x: 0, y: 0, z: 0 };
  buildStructure(scene, jsonData, position);
}

export { createWorld, createSimpleWorld, drawCenter };
