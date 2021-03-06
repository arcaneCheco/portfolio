import * as THREE from "three";
import Experience from "./Experience";
import font from "../manifold.json";
import createTextGeometry from "./textGeometry/index.js";
import particleVertexShader from "./shaders/textOutline/particleVertex.js";
import particleFragmentShader from "./shaders/textOutline/particleFragment.js";
import outlineVertexShader from "./textGeometry/outlineVertexShaderSimple.js";
import outlineFragmentShader from "./textGeometry/outlineFragmentShaderSimple.js";

export default class TextOutline {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.renderer = this.experience.renderer;
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.setGeometry();
    this.setShaderMaterial();
    this.setMesh();
    this.setMouveEvents();
    this.setParticles();

    this.renderer.instance.setClearColor(0x333333);
  }

  setGeometry() {
    this.fontTexture = this.resources.items.manifoldFontTexture;
    this.geometry = createTextGeometry({
      text: "HAVE A GOOD\nDAY",
      font: font,
      align: "center",
      flipY: this.fontTexture.flipY,
    });
  }

  setShaderMaterial() {
    this.gradientMap = this.resources.items.manifoldFontGradient;
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        opacity: { value: 1 },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2() },
        viewport: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        map: { value: this.fontTexture },
        gradientMap: { value: this.gradientMap },
        color: { value: new THREE.Color(0xffffff) },
      },
      vertexShader: outlineVertexShader,
      fragmentShader: outlineFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });
  }

  setMesh() {
    const layout = this.geometry.layout;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(0.01, -0.01, 0.01);
    this.mesh.position.set(
      -(0.01 * layout.width) / 2,
      -(0.01 * layout.height) / 2,
      0
    );
    this.scene.add(this.mesh);
  }

  setMouveEvents() {
    this.mouse = new THREE.Vector2();
    window.addEventListener("mousemove", (event) => {
      this.mouse = new THREE.Vector2(
        event.clientX / window.innerWidth,
        event.clientY / window.innerHeight
      );
      this.material.uniforms.uMouse.value = this.mouse;
      this.particleMaterial.uniforms.uMouse.value = this.mouse;
    });
  }

  setParticles() {
    this.count = 1000;
    this.particleGeometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; i++) {
      positionArray[i * 3] = (Math.random() - 0.5) * 3;
      positionArray[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positionArray[i * 3 + 2] = Math.random() - 0.5;
    }
    this.particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    this.particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: true,
      depthWrite: true,
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector4() },
        uViewport: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
    });
    this.particles = new THREE.Points(
      this.particleGeometry,
      this.particleMaterial
    );
    this.scene.add(this.particles);
  }

  update() {
    if (this.material) {
      this.material.uniforms.uTime.value = this.time.elapsed * 0.001;
    }
  }
}
