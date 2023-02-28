import { defineConfig } from "vite";

export default defineConfig({
    assetsInclude: ['**/*.gltf', '**/*.3DS', '**/*.mp3', '**/*.png'],
    base: '/threejs-test/',
})