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
        fetch: 'readonly',
        CustomEvent: 'readonly',
        localStorage: 'readonly',
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
