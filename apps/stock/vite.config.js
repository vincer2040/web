// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'js/main.js'),
            name: 'main',
            // the proper extensions will be added
            fileName: 'main',
        },
        outDir: resolve(__dirname, "public/static"),
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                },
            },
        },
    },
})
