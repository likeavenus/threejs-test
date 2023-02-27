interface ISongDataProps {
    time: number;
    data: number;
}

/**  примерный алгоритм получения звука бочки и прочих звуков */
export const getSongData = (filteredSound: THREE.Audio, channelData: Float32Array) => {

    const data = channelData;
    const songData: ISongDataProps[] = [];
    const songData2: ISongDataProps[] = [];
    const songData3: ISongDataProps[] = [];

    for (let i = 0; i < data.length; ++i) {
        if (data[i] >= 0.60 && data[i] && data[i] <= 1.2) {
            const time = i / filteredSound.buffer!.sampleRate;
            const previousTime = (songData.length ? songData.at(-1)?.time : 0) as number;
            if (time - previousTime > 0.4) {
                songData.push({
                    data: data[i],
                    time,
                })
            }
        }
        if (data[i] > 0.55 && data[i] <= 0.65) {
            const time = i / filteredSound.buffer!.sampleRate;
            const previousTime = (songData2.length ? songData2.at(-1)?.time : 0) as number;
            if (time - previousTime > 0.4) {
                songData2.push({
                    data: data[i],
                    time,
                })
            }
        }
        if (data[i] >= 0.5 && data[i] < 0.55) {
            const time = i / filteredSound.buffer!.sampleRate;
            const previousTime = (songData3.length ? songData3.at(-1)?.time : 0) as number;
            if (time - previousTime > 0.4) {
                songData3.push({
                    data: data[i],
                    time,
                })
            }
        }
    }

    return [songData, songData2, songData3];
};