// script.js
import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

// === Настройка сцены ===
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();

// === Освещение (обязательно для GLB с материалами) ===
const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 8, 5);
scene.add(dirLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// === Камера ===
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// === Рендерер ===
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// === Загрузка модели ===
let painting = null;
const loader = new GLTFLoader();

loader.load(
  './painting.glb',
  (gltf) => {
    painting = gltf.scene;

    // Центрирование модели
    const box = new THREE.Box3().setFromObject(painting);
    const center = box.getCenter(new THREE.Vector3());
    painting.position.copy(center);
    painting.position.y *= -1;
    painting.position.y += 1.5;

    // Масштабирование под сцену
    const size = box.getSize(new THREE.Vector3()).length();
    const scale = 3 / size;
    painting.scale.set(scale, scale, scale);

    scene.add(painting);
painting.traverse((child) => {
  if (child.isMesh) {
    // Уменьшаем насыщенность и делаем чуть прозрачным
    if (child.material) {
      child.material.opacity = 0.92;
      child.material.transparent = true;
      // уменьшаем шероховатость и металличность
      if (child.material.isMeshStandardMaterial) {
        child.material.roughness = 0.8;
        child.material.metalness = 0.0;
      }
    }
  }
});
    console.log('✅ Модель загружена и добавлена в сцену');
  },
  undefined,
  (error) => {
    console.error('❌ Ошибка загрузки painting.glb:', error);
  }
);

// === Поворот за курсором ===
const targetRotation = { x: 0, y: 0 };
const currentRotation = { x: 0, y: 0 };
const ease = 0.05; // плавность

window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;
  targetRotation.y = x * 0.2;
  targetRotation.x = y * 0.15;
});

// === Анимационный цикл ===
function animate() {
  requestAnimationFrame(animate);

  // Плавный переход к целевому повороту
  currentRotation.x += (targetRotation.x - currentRotation.x) * ease;
  currentRotation.y += (targetRotation.y - currentRotation.y) * ease;

  if (painting) {
    painting.rotation.x = currentRotation.x;
    painting.rotation.y = currentRotation.y;
  }

  renderer.render(scene, camera);
}
animate();

// === Адаптация ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
