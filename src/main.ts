import "./style.css";
import {
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

const scene = new Scene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer(
  {
    canvas: document.querySelector("canvas")!,
  },
);

const starMesh = new Mesh(
  new SphereGeometry(0.01),
  new MeshBasicMaterial({ color: Color.NAMES.white }),
);

const stars = Array.from({ length: 100 }, () => {
  const star = starMesh.clone();
  star.position.copy((new Vector3()).random().subScalar(0.5));

  return star;
});

for (const star of stars) {
  scene.add(star);
}

camera.position.z = 5;

renderer.setAnimationLoop(() => {
  if (
    renderer.domElement.width !== renderer.domElement.clientWidth ||
    renderer.domElement.height !== renderer.domElement.clientHeight
  ) {
    renderer.setSize(
      renderer.domElement.clientWidth,
      renderer.domElement.clientHeight,
      false,
    );
    camera.aspect = renderer.domElement.clientWidth /
      renderer.domElement.clientHeight;
    camera.updateProjectionMatrix();
  }

  camera.translateZ(-0.001);
  renderer.render(scene, camera);
});

addEventListener("mousemove", (ev) => {
  camera.rotateX(ev.movementY * -speed);
  camera.rotateY(ev.movementX * -speed);
  camera.updateMatrixWorld();
  requestAnimationFrame(draw);
});

const deviceEuler = new Euler();
const deviceQuaternion = new Quaternion();
const screenTransform = new Quaternion();
const worldTransform = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

addEventListener("deviceorientation", (ev) => {
  deviceEuler.set(
    degreesToRadians(ev.beta ?? 0),
    degreesToRadians(ev.alpha ?? 0),
    -degreesToRadians(ev.gamma ?? 0),
    "YXZ",
  );

  deviceQuaternion.setFromEuler(deviceEuler);

  screenTransform.setFromAxisAngle(
    new Vector3(0, 0, 1),
    -degreesToRadians(screen.orientation.angle ?? 0),
  );

  deviceQuaternion.multiply(screenTransform);
  deviceQuaternion.multiply(worldTransform);
  camera.quaternion.copy(deviceQuaternion);
  camera.updateMatrixWorld();
  requestAnimationFrame(draw);
});
