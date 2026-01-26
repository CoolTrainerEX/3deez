import "./style.css";
import cat from "./cat.webp";
import { Euler, PerspectiveCamera, Quaternion, Vector3 } from "three";
import { degreesToRadians } from "./util.ts";

const speed = 0.1, size = 1000, sensitivity = 0.0005;
const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

const camera = new PerspectiveCamera();
const destRotation = new Quaternion();
const points = Array.from(
  { length: 100 },
  () => new Vector3().random().subScalar(0.5).multiplyScalar(10),
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
  camera.quaternion.slerp(destRotation, speed);
  camera.updateMatrixWorld();

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

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

addEventListener("mousemove", (ev) => {
  destRotation.multiply(new Quaternion().setFromEuler(
    new Euler().set(
      -ev.movementY * sensitivity,
      -ev.movementX * sensitivity,
      0,
    ),
  ));
});

// deno-lint-ignore no-explicit-any
if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
  // deno-lint-ignore no-explicit-any
  (DeviceOrientationEvent as any).requestPermission();
}

const worldTransform = new Quaternion().setFromAxisAngle(
  new Vector3(1, 0, 0),
  -Math.PI / 2,
);

addEventListener("deviceorientation", (ev) => {
  destRotation.setFromEuler(
    new Euler(
      degreesToRadians(ev.beta ?? 0),
      degreesToRadians(ev.alpha ?? 0),
      -degreesToRadians(ev.gamma ?? 0),
      "YXZ",
    ),
  );

  destRotation.multiply(worldTransform);
});

const card = document.querySelector(".card") as HTMLDivElement;

function rotateCard() {
  const delta = new Euler().setFromQuaternion(
    destRotation.clone().invert().multiply(camera.quaternion),
    "YXZ",
  );

  card.style.transform = ` rotateX(${delta.x * Math.PI}rad) rotateY(${
    -delta.y * Math.PI
  }rad)`;
  requestAnimationFrame(rotateCard);
}

requestAnimationFrame(rotateCard);
