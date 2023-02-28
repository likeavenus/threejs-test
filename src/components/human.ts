import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import humanModel from './assets/human/human.gltf';

export const getHuman = (scene: THREE.Scene) => {
    const loadingManager = new THREE.LoadingManager();
    const preloaderElem = document.querySelector('.preloader');
    loadingManager.onStart = () => {
        preloaderElem?.classList.add('active');
    };
    loadingManager.onLoad = () => {
        preloaderElem?.classList.remove('active');
    }
    const loader = new GLTFLoader(loadingManager);
    loader.load(humanModel, (gltf) => {
        gltf.scene.position.y = 1;
        gltf.scene.traverse(function (object) {
            if ((object as THREE.Mesh).isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
        scene.add(gltf.scene);
    });
};