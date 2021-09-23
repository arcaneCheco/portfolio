import * as THREE from "three";
import Experience from "./Experience";

export default class Tree {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.renderer = this.experience.renderer;
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.setModel();
  }

  setModel() {
    this.model = this.resources.items.treeModel.scene;
    this.mesh = this.model.children[0].children[0].children[0].children[0];
    this.mesh.traverse(
      (child) =>
        (child.material = new THREE.MeshBasicMaterial({
          map: this.resources.items.treeModelMap,
        }))
    );
    this.scene.add(this.mesh);
  }
}
