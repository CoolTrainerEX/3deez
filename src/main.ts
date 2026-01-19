import "./style.css";
import cat from "./cat.webp";
import { Euler, PerspectiveCamera, Quaternion, Vector3 } from "three";
import { degreesToRadians } from "./util.ts";

const speed = 1e-3, size = 1e3;
const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const camera = new PerspectiveCamera();
const points = Array.from(
  { length: 100 },
  () => (new Vector3()).random().subScalar(0.5).multiplyScalar(10),
);

const img = new Image();

img.src = cat;

function draw() {
  if (
    canvas.width !== canvas.clientWidth ||
    canvas.height !== canvas.clientHeight
  ) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    camera.aspect = canvas.clientWidth /
      canvas.clientHeight;

    camera.updateProjectionMatrix();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const point of points.map((value) => value.clone().project(camera))) {
    // Check if valid render or invalid matrix calculation.
    if (point.z >= -1 && point.z <= 1) {
      ctx.drawImage(
        img,
        (point.x + 1) / 2 * canvas.width,
        (-point.y + 1) / 2 * canvas.height,
        (-point.z + 1) / 2 * size,
        (-point.z + 1) / 2 * size,
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

// deno-lint-ignore no-explicit-any
(DeviceOrientationEvent as any).requestPermission();

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

const card = document.getElementsByClassName("card")[0] as HTMLDivElement;

card.addEventListener("mousemove", (ev) => {
  card.style.transform = `rotateY(${
    (ev.offsetX / card.clientWidth - 0.5) * 2
  }rad) rotateX(${(ev.offsetY / card.clientHeight - 0.5) * 2}rad)`;
});
