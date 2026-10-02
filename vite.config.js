import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte()],
  test: {
    // Los tests de interaccion (jsdom) necesitan el build de cliente de svelte;
    // el resto renderiza SSR con el build de servidor.
    projects: [
      { extends: true, test: { name: 'ssr', include: ['tests/**/*.test.{js,ts}'], exclude: ['tests/**/*.dom.test.js'] } },
      {
        extends: true,
        resolve: { conditions: ['browser'] },
        test: { name: 'dom', include: ['tests/**/*.dom.test.js'], environment: 'jsdom' },
      },
    ],
  },
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
