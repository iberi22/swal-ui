# @swal/ui Roadmap

Official roadmap and engineering milestones for `@swal/ui`, the core design system and component library powering SouthWest AI Labs (SWAL) applications.

---

## 1. Vision & Core Principles

`@swal/ui` delivers a cohesive, lightweight, accessible user interface system across the SWAL decentralized application ecosystem. It bridges web applications (Astro, Svelte 5, PWA), mobile interfaces (Flutter tokens), and developer tools (dashboards, terminal views).

### Architectural Tenets

1. **Svelte 5 Runes Native**: Built strictly on Svelte 5 reactivity (`$state`, `$props`, `$derived`, `$bindable`, `$effect`). No legacy stores, zero legacy lifecycle hooks.
2. **Zero Runtime Dependencies**: Every component ships with scoped CSS and native web APIs. Svelte is our only peer dependency (`^5.0.0`).
3. **Bone Theme as Canonical Default**: A refined warm-minimalist aesthetic (bone white, mineral stone dark, high-contrast accents) defined strictly through CSS custom properties. No hardcoded hex values in component templates.
4. **First-Class Astro Islands & SSR**: Every component renders safely in server-side environments (Node.js, Cloudflare Workers, workerd) and hydrates cleanly under Astro island directives (`client:load`, `client:visible`, `client:idle`).
5. **Accessibility by Default**: Target WCAG 2.2 Level AA compliance across all components, including keyboard navigation, focus trapping, screen-reader semantics, and measured luminance ratios.

---

## 2. Current State (v0.2.0 Measured Baseline)

As of version `0.2.0`, the library exhibits the following measured metrics:

- **Component Count**: 28 Svelte components located under `src/components/`:
  - *Primitives*: `Button`, `Card`, `Badge`, `Input`, `Table`, `Tabs`, `Skeleton`, `Modal`
  - *System & Edge-Hive*: `StatusBadge`, `LoadingState`, `Terminal`, `CommandPalette`, `Toaster`, `LogViewer`, `ConfigEditor`
  - *Layout & Shell*: `AppShell`, `MobileNav`, `DashboardLayout`, `GlobalTicker`, `Landing`, `Icon`
  - *Preferences & Offline*: `PrefsEditor`, `OnboardingWizard`, `ThemeModeSwitch`, `StorageStatus`, `BackupPanel`, `ConfigFloatingWindow`, `QRCode`
- **Test Suite**: 19 test suites, 191 automated unit and DOM tests passing via Vitest (`pnpm test`).
- **Package Distribution (`npm pack --dry-run`)**:
  - Compressed Tarball: **89.0 kB**
  - Unpacked Total Size: **311.7 kB**
  - Packaged Files: **65 files** (all `.db`, WAL, and temporary agent artifacts excluded)
  - Built Assets: `dist/ui.css` (50.07 kB / 8.44 kB gzip), `dist/ui.js` (100.07 kB / 25.06 kB gzip)
- **Ecosystem Adoption**: Actively consumed by SWAL applications:
  - `apps/demo-tienda` (e-commerce catalog and cart)
  - `apps/maloca-analytics` (telemetry and node monitoring)
  - `apps/pisastyle` (generative AUI components and dynamic style inspection)
  - `apps/swal-training` (offline PWA fitness logger with custom shell and toast notifications)
  - `apps/content-studio` & `apps/nido` (scaffold and template consumption)

---

## 3. Milestones & Deliverables

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│     v0.3 Milestone     │      │     v0.4 Milestone     │      │     v1.0 Milestone     │
│  Typed & Accessible    │ ───► │ Theming & Multi-Surface│ ───► │  Production GA & LTS   │
│         Core           │      │         Polish         │      │      Stability         │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

### Milestone 0.3: Typed & Accessible Core

**Focus**: Complete TypeScript definitions, eliminate ambient consumer declarations, guarantee Astro SSR resilience, and formalize accessibility primitives.

#### Concrete Deliverables
- [ ] **Root and Subpath TypeScript Declarations**:
  - Ship comprehensive `.d.ts` declaration files for `.` (`src/components/index.d.ts`), `./toast`, `./tokens`, `./nav`, `./storage`, and `./backup`.
  - Export prop interfaces for all 28 components (`ButtonProps`, `ModalProps`, `CardProps`, etc.).
  - Remove requirement for consumer-side `declare module '@swal/ui'` overrides in `apps/pisastyle` and `apps/swal-training`.
- [ ] **Astro Islands Compatibility Test Suite**:
  - Automated test runner validating server rendering and hydration for all 28 components in an Astro harness (resolving Issue #10: `UI-ASTRO-01`).
  - Zero browser-only globals (`window`, `document`, `navigator`) executed during SSR module import.
- [ ] **WCAG 2.2 Level AA Accessibility Hardening**:
  - Focus trap and `aria-modal="true"` validation in `Modal` and `CommandPalette`.
  - ARIA tablist/tab/tabpanel keyboard navigation (Arrow keys, Home, End) in `Tabs`.
  - Proper label association and invalid state indicators in `Input`.
  - Automated `axe-core` accessibility test suite integration.
- [ ] **Toast System Formalization**:
  - Type-safe toast dispatcher with configurable timeouts, pause-on-hover, and dismiss actions.

#### Exit Criteria
- `tsc --noEmit` and `pnpm test` pass with 100% type coverage across package exports.
- Zero consumer apps require manual ambient typing for `@swal/ui` imports.
- Automated SSR test matrix renders all 28 components without runtime errors.
- Automated axe audit returns 0 violations on default states.

---

### Milestone 0.4: Unified Theming & Multi-Surface Polish

**Focus**: Deepen design token expressiveness, finalize responsive shells, stabilize Flutter token extraction, and launch an interactive component catalog.

#### Concrete Deliverables
- [ ] **Design Tokens 2.0**:
  - Standardize token scale: surface elevation layers (`--swal-surface-0` through `--swal-surface-3`), spacing units (`--swal-space-*`), radius scales, and animation curves.
  - Multi-theme contrast matrix: Bone (default), Bone-Taller (orange accent), TikPro (teal accent), and Antigravity themes all validated with automated luminance scoring.
  - Runtime theme switcher helper with system preference listener (`prefers-color-scheme`).
- [ ] **Standardized App Shell Primitives**:
  - Unify `AppShell`, `MobileNav`, and bottom navigation tab bars across PWA apps (completing Fize shell extraction).
  - Responsive breakpoint tokens aligned between CSS and JS helpers.
- [ ] **Interactive Documentation & Catalog Site**:
  - Standalone documentation site built with Astro and `@swal/ui` components showcasing interactive demos, copyable code snippets, and token inspector.
- [ ] **Flutter Design Token Synchronization**:
  - Stabilize `scripts/gen-flutter-tokens.mjs` with strict semantic color matching for Dart theme classes in `flutter/`.

#### Exit Criteria
- `pnpm run themes:ecosistema` executes clean with AAA rating on body text and AA on UI controls for all themes.
- Interactive catalog site deployed and accessible within the monorepo.
- `flutter/` package passes `flutter analyze` or Dart unit tests against generated tokens.

---

### Milestone 1.0: Production General Availability & Long-Term Support

**Focus**: API contract freeze, strict SemVer governance, performance budgets, and long-term ecosystem maintenance.

#### Concrete Deliverables
- [ ] **API Contract Freeze**:
  - Finalized, non-breaking prop contracts across all components.
  - Published deprecation policy (minimum one minor release cycle with deprecation warnings before breaking removal).
- [ ] **Automated Visual Regression Testing**:
  - Playwright visual snapshot tests for dark and light variants of all components.
- [ ] **Bundle Size and Performance Budgets**:
  - Gzip bundle size cap enforced in CI: core JS < 30 kB, core CSS < 10 kB.
  - Zero hydration mismatch guarantees.
- [ ] **Automated Release Pipeline with Provenance**:
  - GitHub Actions automated npm publishing using GitHub OIDC provenance (`--provenance`).
  - Automated changelog generation based on conventional commits.
- [ ] **Full Ecosystem Migration**:
  - 100% of internal SWAL applications migrated to `@swal/ui@1.0.0` with no local vendored duplicates.

#### Exit Criteria
- All 6 consumer apps in `apps/*` run on `@swal/ui@1.0.0` with 0 local component patches.
- CI pipelines in `iberi22/swal-ui` include lint, types, unit tests, a11y, and visual regression tests.
- Provenance attested on npm registry.

---

## 4. Non-Goals

To maintain high performance and clean architectural boundaries, `@swal/ui` explicitly excludes:

1. **Complex Data Visualization / Heavy Chart Engines**: High-cardinality charts, WebGL canvases, or heavy D3 wrappers do not belong in `@swal/ui`. Applications should consume dedicated visualization libraries styled with SWAL CSS variables.
2. **Framework Bridges for React, Vue, or Angular**: `@swal/ui` is optimized for Svelte 5 and Astro. Cross-framework sharing is achieved via CSS tokens and standard web components if ever needed, not multi-framework wrapper maintenance.
3. **Application State & Backend Coupling**: No state machines, authentication handlers, WebSocket listeners, or API clients are bundled inside the UI library. Offline storage utilities (`src/lib/storage.js`, `src/lib/backup.js`) are limited to local persistence status and format validation.
4. **Third-Party Icon Font Bundles**: Icons are lightweight SVG snippets rendered through `Icon.svelte`, not massive third-party icon fonts.

---

## 5. How to Propose Changes

We welcome enhancements from across the SWAL team and open-source community:

1. **Check Existing Issues**: Review open issues and discussion threads on [GitHub Issues](https://github.com/iberi22/swal-ui/issues).
2. **Submit a Proposal**: Use the [Feature Request Issue Template](.github/ISSUE_TEMPLATE/feature_request.yml) describing the motivation, component API, and how it aligns with the Bone theme tokens.
3. **Draft Implementation**:
   - Work in a feature branch branched from `main`.
   - Adhere to Svelte 5 runes syntax (`$props()`, `$state()`).
   - Use CSS tokens from `src/tokens/theme.css` without hardcoded colors.
   - Include unit tests in `tests/` and verify with `pnpm test && pnpm run check`.
4. **Pull Request**: Open a PR with our [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md). Ensure CI is green and the Contributor License Agreement (CLA) is accepted.
