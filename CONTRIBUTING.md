# Contributing to @swal/ui

Thank you for contributing to `@swal/ui`, the official design system for SouthWest AI Labs (SWAL).

All contributions must adhere to the [Apache License 2.0](./LICENSE) and the [Contributor License Agreement](./CLA.md).

---

## Core Principles

1. **Svelte 5 Runes Native**:
   - Write components exclusively using Svelte 5 reactivity runes (`$state`, `$props`, `$derived`, `$bindable`, `$effect`).
   - Do not use legacy Svelte 3/4 syntax, stores, or lifecycle functions (`onMount`, `onDestroy`).
2. **Zero Runtime Dependencies**:
   - Keep components lightweight and scoped. Only native web APIs and Svelte peer dependency (`^5.0.0`) are allowed.
3. **Bone Theme Tokens**:
   - All component colors, surfaces, borders, and typography must use CSS variables from `src/tokens/theme.css`.
   - Never use hardcoded hex, rgb, or hsl values inside `.svelte` files.
4. **Astro Islands & SSR Compatibility**:
   - Components must render cleanly in server-side environments (Node.js, Cloudflare Workers, workerd).
   - Guard browser-specific APIs (`window`, `document`, `navigator`, `localStorage`) behind `$effect` or client checks.
5. **English-Only**:
   - Code, comments, documentation, commit messages, and pull request descriptions must be in English.

---

## Development Workflow

### Prerequisites
- Node.js >= 18
- pnpm (recommended package manager for SWAL)

### Setup & Local Development
```bash
# Clone the repository
git clone https://github.com/iberi22/swal-ui.git
cd swal-ui

# Install dependencies
pnpm install

# Start the interactive component demo
pnpm run dev
```

### Verification Commands
Before opening a pull request, run the complete validation suite:
```bash
# Run linting
pnpm run lint

# Run TypeScript typechecks
pnpm run typecheck

# Run automated unit and DOM tests
pnpm test

# Run theme accessibility and contrast audit
pnpm run themes:audit

# Verify production build
pnpm run build

# Verify package tarball contents
npm pack --dry-run
```

---

## Pull Request Guidelines

1. **Branching**: Branch from `main` with a descriptive name (e.g., `feat/tabs-keyboard-nav`, `fix/modal-focus-trap`).
2. **Conventional Commits**: Format commit messages following the Conventional Commits specification:
   - `feat(component): add keyboard navigation to Tabs`
   - `fix(button): prevent click propagation when disabled`
   - `docs(roadmap): update milestone 0.3 exit criteria`
3. **File Islands**: Only modify files within your task scope.
4. **No Secrets or Binary Blobs**: Never commit API keys, tokens, or temporary databases (`.db`, `.sqlite`, `.wal`).
5. **CLA Sign-Off**: By submitting a pull request, you confirm acceptance of our [Contributor License Agreement (CLA)](./CLA.md) under Apache License 2.0.
