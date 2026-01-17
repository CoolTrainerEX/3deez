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
const camera = new PerspectiveCamera(undefined, innerWidth / innerHeight);
const renderer = new WebGLRenderer(
  /*{
  canvas: document.getElementById("c") as HTMLCanvasElement,
}*/
);

renderer.setSize(innerWidth, innerHeight);

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
  const canvas = renderer.domElement;

  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  camera.translateZ(-0.001);
  renderer.render(scene, camera);
});
