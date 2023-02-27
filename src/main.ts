import * as THREE from 'three';
import './style.css';
import { getPlane } from './components/plane';
import { getControls } from './components/controls';
import { getSpotLight } from './components/spotlight';
import { getAudio } from './components/audio';
import { SPOTLIGHT1_OPTIONS, SPOTLIGHT2_OPTIONS, SPOTLIGHT3_OPTIONS } from './constants';
import { getHuman } from './components/human';
import { getSongData } from './utils/getSongData';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// добавляем модель человека
getHuman(scene);

camera.position.set(0, 50, 80);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const plane = getPlane();

scene.add(plane);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg') as HTMLCanvasElement,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const orbitControls = getControls(camera, renderer);

const ambientLight = new THREE.AmbientLight('rgb(50, 1, 205)', 0.2);
scene.add(ambientLight);


(async () => {
  const { filteredSound, normalSound, clock } = await getAudio(camera);
  // добавляем 3 прожектора на сцену
  const [spotLight_1] = await getSpotLight({ scene, ...SPOTLIGHT1_OPTIONS });
  const [spotLight_2] = await getSpotLight({ scene, ...SPOTLIGHT2_OPTIONS });
  const [spotLight_3] = await getSpotLight({ scene, ...SPOTLIGHT3_OPTIONS });

  const data = filteredSound.buffer?.getChannelData(0) as Float32Array;
  const [songData, songData2, songData3] = getSongData(filteredSound, data);

  let i = 0;
  let k = 0;
  let j = 0;

  let intensity = 1.2;

  function animate() {
    if (normalSound.isPlaying) {
      camera.rotation.x += intensity * 0.01;

      const currentTime = clock.getElapsedTime();

      if (currentTime >= songData[i].time) {
        intensity = 1.2;
        spotLight_1.intensity = 1.1;
        if (songData[i + 1]) {
          i++;
        }
      } else {
        if (intensity >= 0) {
          intensity -= 0.01;
        } else {
          intensity = 1.2;
        }
        spotLight_1.intensity = intensity;
      }

      if (currentTime >= songData2[k].time) {
        spotLight_2.intensity = 2;
        if (songData2[k + 1]) {
          k++;
        }
      } else {
        spotLight_2.intensity = 0;
      }

      if (currentTime >= songData3[j].time) {
        spotLight_3.intensity = 1.5;
        if (songData3[j + 1]) {
          j++;
        }
      } else {
        spotLight_3.intensity = 0;
      }
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    orbitControls.update();
  }
  animate()

})();






