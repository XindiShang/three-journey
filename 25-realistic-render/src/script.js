import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
// hamburger model is compressed with draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh &&
            child.material instanceof THREE.MeshStandardMaterial
        ) {
            // no need to add this line, just apply the environment map to the scene
            // child.material.envMap = environmentMapTexture
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true

            // shadow
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMapTexture.encoding = THREE.sRGBEncoding

// Apply the environment map to the scene
scene.background = environmentMapTexture
// Apply the environment map to the materials
scene.environment = environmentMapTexture

debugObject.envMapIntensity = 5
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)


/**
 * Test sphere
 */
// const testSphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial()
// )
// scene.add(testSphere)

/**
 * Models
 */
gltfLoader.load(
    '/models/hamburger.glb',
    // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        // helmet
        // gltf.scene.position.set(0, - 4, 0)
        // gltf.scene.scale.set(10, 10, 10)
        // gltf.scene.rotation.y = Math.PI * 0.5
        // scene.add(gltf.scene)

        // have to update the gui after the model is loaded
        // gui.add(gltf.scene.rotation,÷ 'y').min(- Math.PI).max(Math.PI).step(0.001).name('modelRotation')

        // burger
        gltf.scene.position.set(0, - 1, 0)
        gltf.scene.scale.set(0.3, 0.3, 0.3)
        scene.add(gltf.scene)

        updateAllMaterials()
    },
    (progress) => {
        console.log('progress', progress)
    },
    (error) => {
        console.log('error', error)
    }
)


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#fff', 3)
directionalLight.position.set(0.25, 3, - 2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
}).onFinishChange(() => {
    // have to convert the string to number
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterials()
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()