import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";
import {
  AmbientLight,
  BoxBufferGeometry,
  ConeBufferGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  Fog,
  Group,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PlaneBufferGeometry,
  PointLight,
  RepeatWrapping,
  SphereBufferGeometry,
  TextureLoader,
} from "three";

/**
 * Base
 */
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, {
      duration: 1,
      y: mesh.rotation.y + Math.PI * 2,
    });
  },
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Texture
const textureLoader = new TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorMetalTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughTexture = textureLoader.load("/textures/door/roughness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");

const brickColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const brickNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const brickRoughTexture = textureLoader.load("/textures/bricks/roughness.jpg");
const brickAoTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughTexture = textureLoader.load("/textures/grass/roughness.jpg");
const grassAoTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);

grassColorTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughTexture.repeat.set(8, 8);
grassAoTexture.repeat.set(8, 8);

grassAoTexture.wrapS = RepeatWrapping;
grassColorTexture.wrapS = RepeatWrapping;
grassNormalTexture.wrapS = RepeatWrapping;
grassRoughTexture.wrapS = RepeatWrapping;

grassAoTexture.wrapT = RepeatWrapping;
grassColorTexture.wrapT = RepeatWrapping;
grassNormalTexture.wrapT = RepeatWrapping;
grassRoughTexture.wrapT = RepeatWrapping;

// Scene
const scene = new THREE.Scene();

// Light
const ambientLight = new AmbientLight(0xffffff, 0.12);

const moonLight = new DirectionalLight(0xffffff, 0.12);
moonLight.position.set(4, 5, -2);

const doorLight = new PointLight(0xff7d46, 1, 7);
doorLight.position.set(0, 2.2, 2.7);

scene.add(ambientLight, moonLight, doorLight);

// Ghost
const ghost1 = new PointLight(0xff00ff, 0.5);
const ghost2 = new PointLight(0xffff00, 0.5);
const ghost3 = new PointLight(0x00ffff, 0.5);

scene.add(ghost1, ghost2, ghost3);

// Fog
const fog = new Fog(0x262837, 1, 15);
scene.fog = fog;

/**
 * Objects
 */

// Floor
const floorGeometry = new PlaneBufferGeometry(20, 20);
const material = new MeshStandardMaterial({
  map: grassColorTexture,
  aoMap: grassAoTexture,
  normalMap: grassNormalTexture,
  roughnessMap: grassRoughTexture,
});

const floor = new Mesh(floorGeometry, material);
floor.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// House
const house = new Group();
scene.add(house);

// Walls
const walls = new Mesh(
  new BoxBufferGeometry(4, 2.5, 4),
  new MeshStandardMaterial({
    aoMap: brickAoTexture,
    map: brickColorTexture,
    normalMap: brickNormalTexture,
    roughnessMap: brickRoughTexture,
  })
);

walls.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);

walls.position.y = 1.25;
house.add(walls);

// Roof
const roof = new Mesh(
  new ConeBufferGeometry(3.5, 1.5, 4),
  new MeshStandardMaterial({
    color: 0xb35f45,
  })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;

house.add(roof);

// Door
const door = new Mesh(
  new PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new MeshStandardMaterial({
    alphaMap: doorAlphaTexture,
    transparent: true,
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalTexture,
    roughnessMap: doorRoughTexture,
  })
);

door.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = 2 + 0.001;
door.position.y = 1;

house.add(door);

// Bushes
const bushGeometry = new SphereBufferGeometry(1, 16, 16);
const bushMaterial = new MeshStandardMaterial({ color: 0x89c854 });

const bush1 = new Mesh(bushGeometry, bushMaterial);
bush1.position.set(0.8, 0.2, 2.2);
bush1.scale.set(0.5, 0.5, 0.5);

const bush2 = new Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.2, 2.2);

const bush4 = new Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new Group();
scene.add(graves);

const graveGeometry = new BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new MeshStandardMaterial({ color: 0xb2b6b1 });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;

  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.4, z);
  grave.castShadow = true;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.2;
  graves.add(grave);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullScreenElement =
    window.fullscreenElement || window.webkitFullscreenElement;

  if (!fullScreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen;
    }
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x262837);

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
moonLight.castShadow = true;
doorLight.castShadow = true;

ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
door.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.far = 7;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Ghost
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
