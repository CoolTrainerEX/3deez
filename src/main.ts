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
