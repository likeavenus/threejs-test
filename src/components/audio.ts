import * as THREE from "three";

export async function getAudio(camera: THREE.Camera) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const filteredSound = new THREE.Audio(listener);
    const normalSound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    const audioPromise = new Promise((resolve, reject) => {
        audioLoader.load('src/assets/winners.mp3', function (buffer) {
            normalSound.setBuffer(buffer);

            const ctx = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
            const src = ctx.createBufferSource();
            src.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = "bandpass";
            filter.frequency.value = 100;
            filter.Q.value = 1;

            const filter2 = ctx.createBiquadFilter();
            filter2.type = "peaking";
            filter2.frequency.value = 100;
            filter2.Q.value = 1;
            filter2.gain.value = 15;


            src.connect(filter2);
            filter2.connect(filter);
            filter.connect(ctx.destination);
            filteredSound.setBuffer(buffer);

            src.start(0);
            ctx.startRendering().then((renderedBuffer) => {
                filteredSound.setBuffer(renderedBuffer)
            })

            resolve({ filteredSound, normalSound });
        }, undefined, reject);
    })
    const playButton = document.querySelector('.play-button');
    await audioPromise as THREE.Audio;

    const clock = new THREE.Clock();

    playButton!.addEventListener('click', () => {
        clock.start();
        normalSound.play();
    });

    return { filteredSound, normalSound, clock };
}