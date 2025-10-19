import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import checker from 'vite-plugin-checker';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const srcDir = path.resolve(__dirname, 'src');

// find all *-processor.ts files
const processorEntries = Object.fromEntries(
    fs.readdirSync(srcDir)
        .filter(f => f.endsWith('-processor.ts'))
        .map(f => [f.replace('.ts', ''), path.join(srcDir, f)])
);

export default defineConfig({
    plugins: [
        checker({ typescript: true })
    ],
    build: {
        // force "library" build so Vite doesn't treat these as app assets
        lib: {
            entry: processorEntries,
            formats: ['es'],
        },
        outDir: path.resolve(__dirname, '../app/static/processors'), //we'll put these here so that they can get served
        emptyOutDir: true,
        target: 'esnext',
        rollupOptions: {
            // prevent content hashes
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name][extname]',
                manualChunks: undefined
            }
        }
    }
});