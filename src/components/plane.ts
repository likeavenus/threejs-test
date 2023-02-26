import * as THREE from 'three';

export const getPlane = (): THREE.Mesh => {
    const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(150, 100);
    const color = new THREE.Color('rgb(255, 255, 255)');
    const material: THREE.Material = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = 1.57;
    plane.position.y = 1;

    return plane;
};