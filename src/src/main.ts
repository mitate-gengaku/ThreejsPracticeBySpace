// main.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// シーンの作成
const scene = new THREE.Scene();
// カメラの作成
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(1, 1, 10);

// カメラ制御の設定
const controls = new OrbitControls(camera, document.querySelector("canvas")!);
controls.enableDamping = true;

const sizes = {
  width: innerWidth,
  height: innerHeight,
};

// レンダラーの作成
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 地球の画質をよくする
  canvas: document.querySelector("canvas")!,
});
renderer.setSize(sizes.width, sizes.height);
// 地球の画質をよくする
renderer.setPixelRatio(window.devicePixelRatio);

// ジオメトリの作成
const sphereGeometry = new THREE.SphereGeometry(5, 50, 50);
// マテリアルの作成
const sphereMaterial = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertex")?.textContent!,
  fragmentShader: document.getElementById("fragment")?.textContent!,
  uniforms: {
    globeTexture: {
      value: new THREE.TextureLoader().load("https://threejs-earth.s3.ap-northeast-1.amazonaws.com/earth.jpeg")
    },
  },
});
// メッシュの作成
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// シーンに追加する。
scene.add(sphere);


// リサイズされる度に更新する関数を実行する。
addEventListener("resize", () => {
  // サイズを更新する
  sizes.width = innerWidth;
  sizes.height = innerHeight;

  // カメラを更新する
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // レンダラーを更新する
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const atomsPhare = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertex")?.textContent!,
    fragmentShader: document.getElementById("fragment")?.textContent!,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
)

atomsPhare.scale.set(1.0, 1.0, 1.0);

scene.add(atomsPhare);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: "0xffffff",
});

const starCount = 12000;
const starPositionArray = new Float32Array(starCount * 3);

for(let i = 0; i < starCount; i++) {
  starPositionArray[i] = (Math.random() - 0.5) * 1000;
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starPositionArray, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars)

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 3, 5);
scene.add(dirLight);

const pointLight = new THREE.PointLight(0xff4000, 0.5, 100);
pointLight.position.set(15, 15, 40);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

const moonGeometry = new THREE.SphereGeometry(2, 10, 10);
const moonTxLoader = new THREE.TextureLoader();
const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  map: moonTxLoader.load("https://threejs-earth.s3.ap-northeast-1.amazonaws.com/2k_moon.jpeg")
})

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);
// ワンフレーム毎に更新する関数をそれぞれ実行する。

let rot = 0;

function animate() {
  rot += 0.005;
  const radian = (rot * Math.PI) / 180;

  moon.rotation.y += 0.002;
  moon.position.x = 20 * Math.cos(rot);
  moon.position.z = 20 * Math.sin(rot);

  renderer.render(scene, camera);
  sphere.rotation.y += 0.005;
  controls.update();
  requestAnimationFrame(animate);
}
animate();
