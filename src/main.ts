import * as THREE from 'three';
import './style.css';
import { getPlane } from './components/plane';
import { getControls } from './components/controls';
import { getSpotLight } from './components/spotlight';
import { getAudio } from './components/audio';
import { SPOTLIGHT1_OPTIONS, SPOTLIGHT2_OPTIONS, SPOTLIGHT3_OPTIONS } from './constants';
import { getHuman } from './components/human';
import { getClouds } from './components/clouds';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// добавляем модель человека
getHuman(scene);
// добавляем туман
getClouds(scene);

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

const ambientLight = new THREE.AmbientLight('rgb(0, 1, 255)', 0.1);
scene.add(ambientLight);


(async () => {
  const { filteredSound, normalSound, clock } = await getAudio(camera);
  // добавляем 3 прожектора на сцену
  const [spotLight_1] = await getSpotLight({ scene, ...SPOTLIGHT1_OPTIONS });
  const [spotLight_2] = await getSpotLight({ scene, ...SPOTLIGHT2_OPTIONS });
  const [spotLight_3] = await getSpotLight({ scene, ...SPOTLIGHT3_OPTIONS });

  // примерный алгоритм получения звука бочки и прочих звуков
  interface ISongData {
    time: number;
    data: number;
  }
  const songData: ISongData[] = [];
  const songData2: ISongData[] = [];
  const songData3: ISongData[] = [];
  const data = filteredSound.buffer?.getChannelData(0) as Float32Array;

  for (let i = 0; i < data!.length; i++) {
    if (data![i] > 0.8 && data![i]) {
      const time = i / filteredSound.buffer!.sampleRate;
      const previousTime = (songData.length ? songData.at(-1)?.time : 0) as number;
      if (time - previousTime > 0.4) {
        songData.push({
          data: data![i],
          time,
        })
      }
    }
    if (data[i] > 0.73 && data[i] <= 0.8) {
      const time = i / filteredSound.buffer!.sampleRate;
      const previousTime = (songData2.length ? songData2.at(-1)?.time : 0) as number;
      if (time - previousTime > 0.4) {
        songData2.push({
          data: data![i],
          time,
        })
      }
    }
    if (data[i] >= 0.5 && data[i] < 0.6) {
      const time = i / filteredSound.buffer!.sampleRate;
      const previousTime = (songData3.length ? songData3.at(-1)?.time : 0) as number;
      if (time - previousTime > 0.4) {
        songData3.push({
          data: data![i],
          time,
        })
      }
    }
  }

  let i = 0;
  let k = 0;
  let j = 0;

  function animate() {
    if (normalSound.isPlaying) {
      const currentTime = clock.getElapsedTime();

      if (currentTime >= songData[i].time) {
        spotLight_1.intensity = 2;
        i++;
      } else {
        spotLight_1.intensity = 0;
      }

      if (currentTime >= songData2[k].time) {
        spotLight_2.intensity = 1.4;
        k++;
      } else {
        spotLight_2.intensity = 0;
      }

      if (currentTime >= songData3[j].time) {
        spotLight_3.intensity = 1.5;
        j++;
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






