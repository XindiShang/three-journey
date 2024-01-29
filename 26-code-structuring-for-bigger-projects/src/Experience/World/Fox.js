import * as THREE from "three";
import Experience from "../Experience";

export default class Fox {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.time = this.experience.time;

    // Set up
    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resources.items.foxModel;
    this.model.scene.scale.set(0.02, 0.02, 0.02);

    this.scene.add(this.model.scene);

    // in case there are multiple models in the scene
    this.model.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model.scene);
    this.animation.action = this.animation.mixer.clipAction(this.model.animations[0]);
    console.log(this.model);
    this.animation.action.play();
  }

  update() {
    if (this.animation) {
      this.animation.mixer.update(this.time.delta * 0.001); // convert to milliseconds
    }
  }
}