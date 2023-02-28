import * as THREE from "https://unpkg.com/three/build/three.module.js"; // Our Javascript will go here.

// FOUR elements to get started
// - a scene to contain objects, like a set in a movie
// - some objects (primitive geometries, imported models, particles, etc.), also called a mesh
// - a camera
// - a renderer

const scene = new THREE.Scene();

// a mesh requires a geometry(shape) and a material(how it looks)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'lightblue' });
const mesh = new THREE.Mesh(geometry, material);

// add the mesh to the scene
scene.add(mesh);

// camera
const sizes = {
  width: 800,
  height: 600
}
// args: (field of view, aspect ratio, near, far)
// - fov can be in degrees or radians
// - aspect ratio is the width/height of the canvas
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
scene.add(camera);

// a renderer is the result that gets drawn to the canvas, usually the HTML <canvas> element
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.width, sizes.height);

// move the camera back so we can see the cube
camera.position.z = 4;

// let the magic happen!
renderer.render(scene, camera);
