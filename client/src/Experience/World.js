import Experience from "./Experience.js";
// import TextOutline from "./TextOutline.js";
import Tree from "./Tree.js";
import Floor from "./Floor.js";
import CameraManager from "./CameraManager.js";
import ContentManager from "./ContentManager.js";
// import Water from "./Water.js";
import BgTerrain from "./BgTerrain.js";
import * as THREE from "three";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.resources.on("end", () => {
      // this.setDummy();
      this.setBgTerrain();
      this.setTree();
      this.setFloor();
      // this.setCameraManager();
      this.setContentManager();
      // this.setWater();
    });
  }

  setDummy() {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        map: this.resources.items.lennaTexture,
        depthWrite: false,
        depthTest: false,
      })
    );
    this.scene.add(cube);
  }

  setTree() {
    this.tree = new Tree();
  }

  setFloor() {
    this.floor = new Floor();
  }
  setCameraManager() {
    this.cameraManager = new CameraManager();
  }

  setContentManager() {
    this.contentManager = new ContentManager();
  }

  setBgTerrain() {
    this.bgTerrain = new BgTerrain();
  }

  // setWater() {
  //   this.water = new Water();
  // }

  resize() {
    if (this.bgTerrain) {
      this.bgTerrain.resize();
    }
  }

  update() {
    if (this.bgTerrain) {
      this.bgTerrain.update();
    }
  }

  destroy() {}
}
