import * as THREE from "three";
import Experience from "./Experience";
import gsap from "gsap";

export default class CameraManager {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.modes.debug.instance;
    this.debug = this.experience.debug;

    this.setInitialCamera();
    this.setSceneStates();

    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: "CameraManager",
      });
      this.debugFolder.addMonitor(this.camera.position, "x", {
        label: "positionX",
      });
      this.debugFolder.addMonitor(this.camera.position, "y", {
        label: "positionY",
      });
      this.debugFolder.addMonitor(this.camera.position, "z", {
        label: "positionZ",
      });
      this.debugFolder.addMonitor(this.camera.rotation, "x", {
        label: "rotationX",
      });
      this.debugFolder.addMonitor(this.camera.rotation, "y", {
        label: "rotationY",
      });
      this.debugFolder.addMonitor(this.camera.rotation, "z", {
        label: "rotationZ",
      });
      this.debugFolder
        .addButton({ title: "toAboutSection" })
        .on("click", () => this.toAbout());
      this.debugFolder
        .addButton({ title: "toHomeSection" })
        .on("click", () => this.toHome());
      this.debugFolder
        .addButton({ title: "toContactSection" })
        .on("click", () => this.toContact());
    }
  }

  setSceneStates() {
    this.homePosition = new THREE.Vector3(0, 0.35, 2.5);
    this.homeRotation = new THREE.Vector2(-0.36, 0);
    this.aboutPosition = new THREE.Vector3(1.95, 1.75, -1.85);
    this.aboutRotation = new THREE.Vector2(-0.05, 2.35);
    this.contactPosition = new THREE.Vector3(-0.16, 2.23, 3.27);
    this.contactRotation = new THREE.Vector2(-0.1, 0.41);
  }

  setInitialCamera() {
    this.camera.position.set(0, 0.35, 2.5);
    this.camera.rotation.set(-0.36, 0, 0); // x == -0.36
  }

  toHome() {
    gsap.to(this.camera.position, {
      duration: 1,
      ...this.homePosition,
      //   ease: "power3.out",
    });
    gsap.to(this.camera.rotation, {
      duration: 1,
      ...this.homeRotation,
      //   ease: "power3.out",
    });
  }

  toAbout() {
    gsap.to(this.camera.position, {
      duration: 1,
      ...this.aboutPosition,
      //   ease: "power3.out",
    });
    gsap.to(this.camera.rotation, {
      duration: 1,
      ...this.aboutRotation,
      //   ease: "power3.out",
    });
  }

  toContact() {
    gsap.to(this.camera.position, {
      duration: 1,
      ...this.contactPosition,
      //   ease: "power3.out",
    });
    gsap.to(this.camera.rotation, {
      duration: 1,
      ...this.contactRotation,
      //   ease: "power3.out",
    });
  }

  update() {}
}
