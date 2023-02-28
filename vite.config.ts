import { defineConfig } from "vite";

export default defineConfig({
    assetsInclude: ['**/*.gltf', '**/*.mp3', '**/*.png'],
    build: {
        outDir: 'docs'
    },
    base: 'https://github.com/likeavenus/threejs-test',
})