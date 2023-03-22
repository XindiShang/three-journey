import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

// Buffer Geometry
const geometry = new THREE.BufferGeometry()

// 1. Set positions by array
// const positionsArray = new Float32Array([
//     0, 0, 0,
//     0, 1, 0,
//     1, 0, 0
// ])

const COUNT = 500
const positionsArray = new Float32Array(COUNT * 3 * 3) // 3 vertices per triangle, 3 values per vertex

for (let i = 0; i < COUNT * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 3
}

const VALUES_PER_VERTEX = 3
const positionsAttribute = new THREE.BufferAttribute(positionsArray, VALUES_PER_VERTEX)

geometry.setAttribute('position', positionsAttribute)

// 2. Set positions by index
// // First vertex
// positionsArray[0] = 0
// positionsArray[1] = 0
// positionsArray[2] = 0

// // Second vertex
// positionsArray[3] = 0
// positionsArray[4] = 1
// positionsArray[5] = 0

// // Third vertex
// positionsArray[6] = 1
// positionsArray[7] = 0
// positionsArray[8] = 0

const material = new THREE.MeshBasicMaterial({
    color: 0xfff,
    wireframe: true
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
console.log(mesh)
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()