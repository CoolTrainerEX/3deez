import "./style.css";
import cat from "./cat.webp";
import { Euler, PerspectiveCamera, Quaternion, Vector3 } from "three";
import { degreesToRadians } from "./util.ts";

const canvas = document.querySelector("canvas")!;
const width = canvas.width = innerWidth,
  height = canvas.height = innerHeight,
  speed = 1e-3;
const ctx = canvas.getContext("2d")!;

const camera = new PerspectiveCamera(undefined, width / height);
const points = Array.from(
  { length: 100 },
  () => (new Vector3()).random().subScalar(0.5).multiplyScalar(10),
);

const img = new Image();

img.src = cat;

function draw() {
  ctx.clearRect(0, 0, width, height);

  for (const point of points.map((value) => value.clone().project(camera))) {
    // Check if valid render or invalid matrix calculation.
    if (point.z >= -1 && point.z <= 1) {
      ctx.drawImage(
        img,
        (point.x + 1) / 2 * width,
        (-point.y + 1) / 2 * height,
        100,
        100,
      );
    }
  }
}

requestAnimationFrame(draw);

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
