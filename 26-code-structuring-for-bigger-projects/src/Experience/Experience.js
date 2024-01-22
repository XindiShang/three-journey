import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";

let instance = null;

export default class Experience {
  constructor(canvas) {
    // singleton
    if (instance) return instance;
    instance = this;

    // global access
    window.experience = this;

    // options
    this.canvas = canvas;

    // setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();

    // sizes resize event
    this.sizes.on('resize', () => {
      this.resize();
    });

    // time tick event
    this.time.on('tick', () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
  }

  update() {
    this.camera.update();
  }
}