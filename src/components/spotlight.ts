import * as THREE from "three";
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';

type TSpotLightPosition = {
    x: number,
    y: number,
    z: number
}
interface IGetSpotLightProps {
    scene: THREE.Scene;
    position: TSpotLightPosition;
    modelPosition: TSpotLightPosition;
    modelRotation: TSpotLightPosition;
    angle: number;
    color: string;
}

export const getSpotLight = async ({ scene, position, modelPosition, modelRotation, angle, color }: IGetSpotLightProps): Promise<[THREE.SpotLight, THREE.Group]> => {
    const light = new THREE.SpotLight(color, 1, 1000, angle, 0.1, 1);
    const { x, y, z } = position;

    light.position.set(x, y, z);
    light.castShadow = true;

    const loader = new TDSLoader();
    const spotLightPromise = new Promise<[THREE.SpotLight, THREE.Group]>((resolve, reject) => {
        loader.load('src/assets/spotlight.3DS', (model) => {
            model.rotation.order = "YXZ";
            model.castShadow = true;
            model.scale.set(0.5, 0.5, 0.5);
            model.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
            model.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
            model.receiveShadow = true;

            resolve([light, model]);
        }, undefined, reject);
    });
    const [spotLight, model] = await spotLightPromise as [THREE.SpotLight, THREE.Group];
    spotLight.intensity = 0;
    scene.add(spotLight);
    scene.add(model);

    return [spotLight, model];
}