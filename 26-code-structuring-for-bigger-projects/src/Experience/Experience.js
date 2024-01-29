import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";
import Resources from "./Utils/Resources";
import sources from "./sources";
import Debug from "./Utils/Debug";

let instance = null;

export default class Experience {
  constructor(canvas) {
    // Singleton
    if (instance) return instance;
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.debug = new Debug(); // initiate first
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // Sizes resize event
    this.sizes.on('resize', () => {
      this.resize();
    });

    // Time tick event
    this.time.on('tick', () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    // update the fox animation in world before renderer
    this.world.update();
    this.renderer.update();
  }

  render() {
    this.renderer.render()
  }

  destroy() {
    this.sizes?.off('resize');
    this.time?.off('tick');

    // Traverse the whole scene and dispose all objects
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        // Dispose geometry
        child.geometry.dispose();

        // Loop through keys of material
        for (const key in child.material) {
          const value = child.material[key];

          // Check if there's a dispose function
          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }

        // Dispose others
        this.camera?.controls?.dispose();
        this.renderer?.instance?.dispose();
        this.debug?.gui.destroy();
      }
    });
  }
}