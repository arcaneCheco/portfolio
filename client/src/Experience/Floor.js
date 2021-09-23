import * as THREE from "three";
import Experience from "./Experience";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.scene = this.experience.scene;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      opacity: 0.5,
      transparent: true,
      color: 0xff0000,
      // normalMap: this.resources.items.waterGradient,
    });
    // this.material = new THREE.ShaderMaterial({
    //   vertexShader: `
    //   void main() {
    //       gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
    //   }
    //   `,
    //   fragmentShader: `
    //   uniform sampler2d uNormal;
    //   void main() {
    //     vec4 tex = texture
    //     gl_FragColor =
    //   }
    //   `
    // })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotateX(-Math.PI / 2);
    this.mesh.position.y -= 0.6;
    this.scene.add(this.mesh);
  }
}
