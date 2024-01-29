import * as THREE from "three";
import Experience from "../Experience";

export default class Fox {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug?.gui?.addFolder("Fox");
    }

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

    this.animation.actions = {};
    this.animation.actions.idle = this.animation.mixer.clipAction(this.model.animations[0]);
    this.animation.actions.walk = this.animation.mixer.clipAction(this.model.animations[1]);
    this.animation.actions.run = this.animation.mixer.clipAction(this.model.animations[2]);

    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    // Play method
    this.animation.play = (name) => {
      const oldAction = this.animation.actions.current;
      const newAction = this.animation.actions[name];

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);

      this.animation.actions.current = newAction;
    }

    // Debug folder 
    // Always check if debug is active
    if (this.debug?.active) {
      const debugObject = {
        playIdle: () => {
          this.animation.play("idle");
        },
        playWalk: () => {
          this.animation.play("walk");
        },
        playRun: () => {
          this.animation.play("run");
        },
      }

      this.debugFolder.add(debugObject, "playIdle");
      this.debugFolder.add(debugObject, "playWalk");
      this.debugFolder.add(debugObject, "playRun");
    }
  }

  update() {
    if (this.animation) {
      this.animation.mixer.update(this.time.delta * 0.001); // convert to milliseconds
    }
  }

}