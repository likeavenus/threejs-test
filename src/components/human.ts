import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const getHuman = (scene: THREE.Scene) => {
    const loader = new GLTFLoader();
    loader.load('src/assets/human/human.gltf', (gltf) => {
        scene.add(gltf.scene);
    });
};