import * as THREE from "three";
import Experience from "./Experience.js";
import createTextGeometry from "./textGeometry/index.js";
import font from "../manifold.json";
import vertexShader from "./shaders/contentManager/vertex.js";
import fragmentShader from "./shaders/contentManager/fragment.js";

export default class ContentManager {
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
    this.fontTexture = this.resources.items.manifoldFontTexture;
    this.geometry = createTextGeometry({
      font: font,
      align: "center",
      text: "ABOUT              CONTACT",
      // flipY: this.fontTexture.flipY,
    });
    // this.contactGeometry = createTextGeometry({
    //   font: font,
    //   align: "center",
    //   text: "ABOUT",
    //   // flipY: this.fontTexture.flipY,
    // });
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      //   side: THREE.DoubleSide,
      transparent: true,
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(0xffffff) },
        uMap: { value: this.fontTexture },
      },
    });
  }

  setMesh() {
    const scale = 0.005;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(scale, scale, scale);
    this.mesh.rotateX(Math.PI);
    const layout = this.geometry.layout;
    this.mesh.position.set(
      -(scale * layout.width) / 2,
      -(scale * layout.height) / 2,
      0
    );
    this.mesh.position.z += 1.1;
    this.scene.add(this.mesh);

    // const contact = this.geometry.clone();
    // console.log(contact);
    // contact.update("CONTACT");
    // const contactMesh = new THREE.Mesh(contact, this.material);
    // contactMesh.position.x += 1;
    // this.scene.add(contactMesh);
  }
}
