import js from '@eslint/js';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'demo/**',
      'tests/**',
      '**/*.svelte',
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        globalThis: 'readonly',
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        getComputedStyle: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        localStorage: 'readonly',
        window: 'readonly',
        // Globales del navegador que usa src/lib/prefs/store.js. Faltaban y
        // daban 6 errores de no-undef en el store de preferencias. El fichero
        // es correcto (cache local + servidor); lo que faltaba era declararlos
        // aqui. Anadirlos al config en vez de silenciar el fichero con un
        // eslint-disable deja la regla sirviendo en el resto del codigo, donde
        // si detectaria un undefined real.
        fetch: 'readonly',
        CustomEvent: 'readonly',
        $state: 'readonly',
        $derived: 'readonly',
        $props: 'readonly',
        $inspect: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
];
