import * as THREE from 'three';

export const getClouds = (scene: THREE.Scene) => {
    const loader = new THREE.TextureLoader();
    loader.load('src/assets/smoke-2.png', (texture) => {
        const geometry = new THREE.PlaneGeometry(500, 500);
        const material = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        });
        const cloud = new THREE.Mesh(geometry, material);
        cloud.position.set(
            Math.random() * 100,
            Math.random() * 100,
            22,
        );
        cloud.rotation.z = Math.random() * 360;
        cloud.material.opacity = 0.6;
        scene.add(cloud);
    });
};