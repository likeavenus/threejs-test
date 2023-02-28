import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const getHuman = (scene: THREE.Scene) => {
    const loader = new GLTFLoader();
    loader.load('/human/human.gltf', (gltf) => {
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