import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: './src/components/index.js',
      formats: ['es'],
    },
    rollupOptions: {
      // Externalizar svelte y TODOS sus submódulos (svelte/transition, etc.)
      external: [/^svelte(\/.*)?$/],
    },
  },
});
