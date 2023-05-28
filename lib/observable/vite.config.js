import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            name: 'observable',
            fileName: 'main',
        },
        rollupOptions: {
            external: [],
            output: {
                globals: {
                },
            },
        },
    },
})

