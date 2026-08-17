# Contributing to @swal/ui

Thank you for contributing to the SWAL Design System!

## Principles
1. **Zero Runtime Dependencies:** Keep component implementations scoped and lightweight.
2. **Svelte 5 Runes:** Use Svelte 5 `$state`, `$props`, `$derived` syntax.
3. **Hive Dark Aesthetics:** Always utilize CSS variables from `src/tokens/theme.css`.
4. **Astro Compatibility:** Ensure components render safely during server-side rendering (SSR).

## Development Workflow
1. Fork and clone the repository.
2. Install dependencies with `npm install`.
3. Run the development server: `npm run dev`.
4. Run code checks and tests:
   ```bash
   npm run check
   npm test
   ```
5. Submit a pull request targeting the `main` branch.
