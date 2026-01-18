import "./style.css";
import war from "./war.svg?raw";
import { Euler, PerspectiveCamera, Quaternion, Vector3 } from "three";
import { degreesToRadians } from "./util.ts";

const speed = 1e-3;
const svg = document.querySelector("svg")!;

const camera = new PerspectiveCamera();
const points = Array.from(
  { length: 100 },
  () => (new Vector3()).random().subScalar(0.5).multiplyScalar(10),
);

const warSVG = (new DOMParser()).parseFromString(war, "image/svg+xml")
  .documentElement;

warSVG.setAttribute("width", String(100));

function draw() {
  if (
    Number(svg.getAttribute("width")) !== svg.clientWidth ||
    Number(svg.getAttribute("height")) !== svg.clientHeight
  ) {
    svg.setAttribute("width", String(svg.clientWidth));
    svg.setAttribute("height", String(svg.clientHeight));
    camera.aspect = svg.clientWidth /
      svg.clientHeight;

    camera.updateProjectionMatrix();
  }

  svg.innerHTML = "";

  for (const point of points.map((value) => value.clone().project(camera))) {
    // Check if valid render or invalid matrix calculation.
    if (point.z >= -1 && point.z <= 1) {
      const warSVGCopy = warSVG.cloneNode(true) as SVGSVGElement;
      warSVGCopy.setAttribute(
        "x",
        String((point.x + 1) / 2 * Number(svg.getAttribute("width"))),
      );
      warSVGCopy.setAttribute(
        "y",
        String((-point.y + 1) / 2 * Number(svg.getAttribute("height"))),
      );
      svg.appendChild(warSVGCopy);
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
