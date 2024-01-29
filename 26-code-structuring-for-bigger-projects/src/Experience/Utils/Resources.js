import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    // Options
    this.sources = sources;

    // Setup 
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      switch (source.type) {
        case 'gltf':
          this.loadGltf(source);
          break;
        case 'texture':
          this.loadTexture(source);
          break;
        case 'cubeTexture':
          this.loadCubeTexture(source);
          break;
        default:
          console.error(`Type ${source.type} is not handled`);
      }
    }
  }

  loadCubeTexture(source) {
    this.loaders.cubeTextureLoader.load(
      source.path,
      (file) => {
        this.sourceLoaded(source, file);
      }
    );
  }

  loadGltf(source) {
    this.loaders.gltfLoader.load(
      source.path,
      (file) => {
        this.sourceLoaded(source, file);

      });
  }

  loadTexture(source) {
    this.loaders.textureLoader.load(
      source.path,
      (file) => {
        this.sourceLoaded(source, file);
      });
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;

    console.log(`${source.name} loaded`);

    if (this.loaded === this.toLoad) {
      this.trigger('ready');
      console.log('All resources loaded');
    }
  }
}