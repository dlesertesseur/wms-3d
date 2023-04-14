import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { createCD, drawCenter } from "./builder";

let camera, controls, scene, renderer;

init();
drawCenter(scene);
createCD(scene);
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth - 2, window.innerHeight - 2);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  //camera.position.set(400, 200, 0);
  camera.position.set(0, 4000, 0);
  camera.add

  // controls
  controls = new MapControls(camera, renderer.domElement);
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 10000;
  controls.maxPolarAngle = 0//Math.PI / 2; 

  // lights
  const dirLight1 = new THREE.DirectionalLight(0xffffff);
  dirLight1.position.set(15, 30, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffffff);
  dirLight2.position.set(-5, 30, 15);
  scene.add(dirLight2);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  //controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();
}

function render() {
  renderer.render(scene, camera);
}
