import * as THREE from "three";
import {
  BASE_LOD_LEVEL,
  PIXEL_METER_RELATION,
  PIXEL_METER_RELATION_CD,
  SCALE,
  SCALE_CD,
  URL_SERVER,
} from "./config";

const positionRegex = /^[A-Z]\d{2}_\d{2}[A-Z]_\d{2}$/;
const columnsRegex = /^(FRONT|BACK) COLUMN - \d+$/;

const matBase = new THREE.MeshLambertMaterial({ color: 0xced4da });
const matShelf = new THREE.MeshLambertMaterial({ color: 0x0000ee });
const matStructure = new THREE.MeshLambertMaterial({ color: 0x868e96 });
const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

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

const layerMap = new Map();
layerMap.set("BASE", 1);
layerMap.set("BACK", 2);
layerMap.set("LEFT", 2);
layerMap.set("RIGHT", 2);
layerMap.set("INTERNAL", 2);
layerMap.set("ESTANTE", 3);
layerMap.set("VISUALITY", 3);
layerMap.set("VISUAL", 3);

function buildStructures(scene, structures, excludeParts) {
  const count = structures.length;
  for (let i = 0; i < count; i++) {
    const structure = structures[i];
    buildStructure(scene, structure, excludeParts);
  }
}

function buildStructuresLOD(scene, structures, excludeParts) {
  const count = structures.length;
  for (let i = 0; i < count; i++) {
    const structure = structures[i];
    buildStructureLOD(scene, structure, excludeParts);
  }
}

function buildCDStructuresLOD(scene, structures, pixelMeterRelation) {
  const count = structures.length;

  /*ASIGNA TIPOS*/
  for (let i = 0; i < count; i++) {
    const structure = structures[i];
    asignaTipo(structure);
  }

  for (let i = 0; i < count; i++) {
    const structure = structures[i];
    buildCDStructureLOD(scene, structure, pixelMeterRelation);
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

function createStructurePart(part, mat) {
  const geometry = new THREE.BoxGeometry(
    part.dim_x * SCALE_CD,
    part.dim_y * SCALE_CD,
    part.dim_z * SCALE_CD
  );

  const grPart = new THREE.Mesh(geometry, mat);

  grPart.name = part.name;
  grPart.position.x = part.pos_x * SCALE_CD;
  grPart.position.y = part.pos_y * SCALE_CD;
  grPart.position.z = part.pos_z * SCALE_CD;
  grPart.updateMatrix();
  grPart.matrixAutoUpdate = false;

  return grPart;
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

function asignaTipo(structure) {
  const parts = structure.parts;

  let base = null;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (positionRegex.test(part.name)) {
      part["type"] = "BASE";
    } else {
      if (columnsRegex.test(part.name)) {
        part["type"] = "STRUCTURE";
      } else {
        part["type"] = "OTHER";
      }
    }
  }
}

function buildCDStructureLOD(scene, structure, pixelMeterRelation = 1) {
  const parts = structure.parts;
  const grStructure = new THREE.Group();
  const grBase = new THREE.Group();
  const grLow = new THREE.Group();
  const grHigh = new THREE.Group();

  grStructure.name = structure.name;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    switch (part.type) {
      case "BASE":
        grBase.add(createStructurePart(part, matShelf));
      case "STRUCTURE":
        grLow.add(createStructurePart(part, matStructure));
      case "OTHER":
        grHigh.add(createStructurePart(part, material));
    }
  }

  const lod = new THREE.LOD();
  lod.addLevel(grHigh, 100);
  lod.addLevel(grLow, 500);
  lod.addLevel(grBase, 2000);

  grStructure.add(lod);
  grStructure.position.x = structure.pos_x * pixelMeterRelation;
  grStructure.position.y = structure.pos_y * pixelMeterRelation;
  grStructure.position.z = structure.pos_z * pixelMeterRelation;
  grStructure.rotateY((structure.rot * 3.14) / 180);

  scene.add(grStructure);
}

function buildStructureLOD(scene, structure) {
  const parts = structure.parts;
  const grStructure = new THREE.Group();
  const grBase = new THREE.Group();
  const grLow = new THREE.Group();
  const grHigh = new THREE.Group();

  grStructure.name = structure.name;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const partPrefix = part.name.split(" ")[0];

    switch (partPrefix) {
      case "BASE":
        grBase.add(createMesh(partPrefix, part));
      case "BACK":
      case "FRONT":
      case "RIGHT":
        grLow.add(createMesh(partPrefix, part));
      case "ESTANTE":
      case "INTERNAL":
      case "VISUALITY":
      case "VISUAL":
        grHigh.add(createMesh(partPrefix, part));
        break;

      default:
        grBase.add(createMesh(partPrefix, part));
        console.log("default ->", partPrefix);
        break;
    }
  }

  var lod = new THREE.LOD();
  lod.addLevel(grHigh, 100);
  lod.addLevel(grLow, 500);
  lod.addLevel(grBase, 2000);

  grStructure.add(lod);
  grStructure.position.x = structure.pos_x * PIXEL_METER_RELATION;
  grStructure.position.y = structure.pos_y * PIXEL_METER_RELATION;
  grStructure.position.z = structure.pos_z * PIXEL_METER_RELATION;
  grStructure.rotateY((structure.rot * 3.14) / 180);

  scene.add(grStructure);
}

async function createWorld(scene, lod = false) {
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
    if (!lod) {
      buildStructures(scene, jsonData);
    } else {
      buildStructuresLOD(scene, jsonData);
    }
  } catch (error) {
    alert(error);
  }
}

async function createCD(scene) {
  const url = URL_SERVER + "/structures";
  const options = {
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };

  try {
    const response = await fetch(url, options);
    const jsonData = await response.json();
    buildCDStructuresLOD(scene, jsonData, PIXEL_METER_RELATION_CD);
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

function createGrid(scene, col = 100, row = 100) {
  const grid = new THREE.GridHelper(col, row);
  //grid.layers.enableAll();
  scene.add(grid);
}

function loadObject(objPath, scene) {
  const loader = new THREE.ObjectLoader();

  loader.load(
    objPath,
    function (obj) {
      scene.add(obj);
    },

    // onProgress callback
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },

    // onError callback
    function (err) {
      console.error("An error happened");
    }
  );
}

export {
  createWorld,
  createSimpleWorld,
  drawCenter,
  loadObject,
  createGrid,
  createCD,
};
