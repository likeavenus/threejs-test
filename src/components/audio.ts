import * as THREE from "three";
import winners from './assets/winners.mp3';

export async function getAudio(camera: THREE.Camera) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const filteredSound = new THREE.Audio(listener);
    const normalSound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    const audioPromise = new Promise((resolve, reject) => {
        audioLoader.load(winners, function (buffer) {
            normalSound.setBuffer(buffer);

            const ctx = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.value = 1000;
            filter.Q.value = 22;
            filter.gain.value = 1000;
            src.connect(filter);
            filter.connect(ctx.destination);
            filteredSound.setBuffer(buffer);

            src.start(0);
            ctx.startRendering().then((renderedBuffer) => {
                filteredSound.setBuffer(renderedBuffer)
                resolve({ filteredSound, normalSound });
            })

        }, undefined, reject);
    })
    await audioPromise as THREE.Audio;

    const clock = new THREE.Clock();
    const playButton = document.querySelector('.play-button');

    playButton!.addEventListener('click', () => {
        clock.start();
        normalSound.play();
    });

    return { filteredSound, normalSound, clock };
}