import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte({ compilerOptions: { customElement: false } })],
  build: {
    lib: {
      entry: './src/components/index.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['svelte', 'svelte/internal'],
    },
  },
});
