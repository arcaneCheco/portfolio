import * as THREE from "three";
import Experience from "./Experience";

export default class BgTerrain {
  constructor() {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(
      -1, // left
      1, // right
      1, // top
      -1, // bottom
      -1, // near,
      0 // far
    );
    this.renderer = this.experience.renderer.instance;
    this.renderer.autoClear = false;
    this.renderer.clear();

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "BgTerrain",
      });
    }

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uRandomRBG: { value: this.resources.items.rgbNoiseMedium },
        uResolution: {
          value: new THREE.Vector2(
            this.config.width / this.config.pixelRatio,
            this.config.height / this.config.pixelRatio
          ),
        },
        uFrequency: { value: 1 / 300 },
        uAmplitude: { value: 1 },
        uIterations: { value: 4 },
      },
      vertexShader: `
      void main() {
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
      }
      `,
      fragmentShader: `
      uniform sampler2D uRandomRBG;
      uniform vec2 uResolution;
      uniform float uFrequency;
      uniform float uAmplitude;
      uniform float uIterations;
      #define TEXTURE_WIDTH 256.0

      float fade(float t) {
        return t*t*t*(t*(t*6.0 - 15.0) + 10.0);
      }

      float grad(float p) {
        float v = texture2D(uRandomRBG, vec2(p / TEXTURE_WIDTH, 0.0)).r;
        return v > 0.5 ? 1.0 : -1.0;
      }

      float noise(float p) {
        float p0 = floor(p);
        float p1 = p0 + 1.0;
          
        float t = p - p0;
        float fade_t = fade(t);
      
        float g0 = grad(p0);
        float g1 = grad(p1);
        
        return (1.0-fade_t)*g0*(p - p0) + fade_t*g1*(p - p1);
      }

      void main() {
        float n = 0.;

        /* Add up noise samples with different frequencies and amplitudes. */
        for(float i = 1.0; i <= uIterations; i++)
        {
            n += noise(gl_FragCoord.x * (uFrequency * pow(2., i - 1.))) * (uAmplitude / pow(2., i - 1.));
        }

        float y = 2.0 * (gl_FragCoord.y/uResolution.y) - 1.0; /* map gl_FragCoord.y into [-1; 1] range */
        vec3 color = n >  y ? vec3(1.0) : vec3(0.0);
        gl_FragColor = vec4(color, color.r);
      }
      `,
    });

    if (this.debug) {
      this.debugFolder.addInput(this.material.uniforms.uFrequency, "value", {
        label: "uFrequency",
        min: 0,
        max: 0.1,
        step: 0.0001,
      });
      this.debugFolder.addInput(this.material.uniforms.uAmplitude, "value", {
        label: "uAmplitude",
        min: 0,
        max: 5,
        step: 0.001,
      });
      this.debugFolder.addInput(this.material.uniforms.uIterations, "value", {
        label: "uIterations",
        min: 0,
        max: 10,
        step: 1,
      });
    }
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  update() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    if (this.material) {
      this.material.uResolution.value = new THREE.Vector2(
        this.config.width / this.config.pixelRatio,
        this.config.height.pixelRatio
      );
    }
  }
}
