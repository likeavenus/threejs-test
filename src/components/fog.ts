import * as THREE from 'three';

export const getFog = () => {
    const fog = new THREE.Fog('rgb(155,100,80)', 1, 100);

    return fog;
}