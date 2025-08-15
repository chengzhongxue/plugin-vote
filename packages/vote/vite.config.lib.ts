import copy from 'rollup-plugin-copy';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { sharedPluginsConfig } from './src/vite/shared-plugin-config';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'vote',
      fileName: 'vote',
      formats: ['iife', 'es'],
    },
    emptyOutDir: true,
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
  plugins: [
    ...sharedPluginsConfig,
    dts(),
    copy({
      targets: [
        {
          src: ['./dist/vote.iife.js', './var.css'],
          dest: fileURLToPath(new URL('../../app/src/main/resources/static', import.meta.url)),
        },
      ],
    }),
  ],
});
