import "./style.css";
import cat from "./cat.webp";
import { PerspectiveCamera, Vector3 } from "three";
import { degreesToRadians } from "./util.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const width = canvas.width = globalThis.innerWidth,
  height = canvas.height = globalThis.innerHeight,
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

draw();

globalThis.addEventListener("mousemove", (ev) => {
  camera.rotateX(ev.movementY * -speed);
  camera.rotateY(ev.movementX * -speed);
  camera.updateMatrixWorld();
  draw();
});

globalThis.addEventListener("deviceorientation", (ev) => {
  camera.rotation.set(
    degreesToRadians(ev.alpha ?? 0),
    degreesToRadians(ev.beta ?? 0),
    degreesToRadians(ev.gamma ?? 0),
  );
  camera.updateMatrixWorld();
  draw();
});
