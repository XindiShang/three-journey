import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const group = new THREE.Group()
group.position.y = 1
group.scale.y = 2
group.rotation.x = Math.PI * 0.25
scene.add(group) // don't forget to add the group to the scene

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.x = -2
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.x = 2
group.add(cube3)

// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)

// // Position
// // mesh.position.y = 1.4
// // mesh.position.x = 2.1
// // mesh.position.z = -1
// mesh.position.set(2.1, 1.4, -1) // same as above

// scene.add(mesh)

// // normalize the vector, which means the length of the vector will be 1, 
// // like the interval of the x, y, z axis
// mesh.position.normalize()

// // get the length of the vector
// console.log(mesh.position.length())

// // Scale
// mesh.scale.x = 2
// mesh.scale.y = 0.5
// mesh.scale.z = 0.5

// // mesh.scale.set(2, 0.5, 0.5)

// // Rotation
// mesh.rotation.reorder('YXZ')
// mesh.rotation.x = Math.PI * 0.25
// mesh.rotation.y = Math.PI * 0.25

/**
 * Axes helper
 */
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.x = 0
camera.position.y = 1
scene.add(camera)

// camera.lookAt(mesh.position)


// // get the distance to another vector
// console.log(mesh.position.distanceTo(new THREE.Vector3(0, 0, 0)))
// // camera is also a Vector3
// console.log(mesh.position.distanceTo(camera.position))

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)