# swal-ui — Functional Requirements

> Requirements specification for `@swal/ui`, tracking `.gitcore/features.json` (protocol 3.9.0).

---

## REQ-001: Design Tokens — Bone & Semantic Palette (feature UI-TOKENS-01)

- **Category:** Functional
- **Priority:** P1
- **SRS Status:** `active`
- **Feature Status:** `completed`
- **Files:** `src/tokens/theme.css`, `src/tokens/colors.css`, `src/themes.css`

Framework-agnostic CSS custom properties defining the warm-minimalist Bone palette (`--swal-bg`, `--swal-surface`, `--swal-text`, `--swal-border`, `--swal-accent`), semantic tokens, and theme variants (Bone, Bone Taller, Taller, Antigravity, TikPro). All color pairs are validated against WCAG 2.2 AA contrast standards.

---

## REQ-002: Core Primitives — Button, Card, Badge, Input, StatusBadge (feature UI-CORE-01)

- **Category:** Functional
- **Priority:** P1
- **SRS Status:** `active`
- **Feature Status:** `completed`
- **Files:** `src/components/Button.svelte`, `src/components/Card.svelte`, `src/components/Badge.svelte`, `src/components/Input.svelte`, `src/components/StatusBadge.svelte`

Zero-dependency Svelte 5 runes implementations with scoped CSS and accessible markup for essential user interface primitives.

---

## REQ-003: Advanced UI Components (feature UI-ADV-01)

- **Category:** Functional
- **Priority:** P1
- **SRS Status:** `active`
- **Feature Status:** `completed`
- **Files:** `src/components/Modal.svelte`, `src/components/Tabs.svelte`, `src/components/Table.svelte`, `src/components/Skeleton.svelte`, `src/components/Toaster.svelte`, `src/components/Terminal.svelte`, `src/components/LogViewer.svelte`, `src/components/CommandPalette.svelte`, `src/components/ConfigEditor.svelte`, `src/components/LoadingState.svelte`

Interactive and stateful UI components including keyboard-navigable command palettes, virtualized log/terminal viewers, modal dialogs with focus trapping and scroll locking, and reactive configuration editors.

---

## REQ-004: Global Styles & Motion Transitions (feature UI-STYLES-01)

- **Category:** Functional
- **Priority:** P2
- **SRS Status:** `active`
- **Feature Status:** `completed`
- **Files:** `src/styles/global.css`, `src/lib/motion.js`, `src/lib/toast.svelte.js`

Shared utility classes (`.swal-glass`, `.swal-mesh-bg`, `.swal-meta`), custom industrial scrollbars, CRT scanline effects, custom Svelte transitions (`swalFade`, `swalSlide`), and singleton reactive toast state management.

---

## REQ-005: Astro Islands Compatibility (feature UI-ASTRO-01)

- **Category:** Functional
- **Priority:** P1
- **SRS Status:** `active`
- **Feature Status:** `completed`
- **Files:** `src/components/`, `demo/astro-islands/src/pages/index.astro`

Full server-side rendering (SSR) safety and client-side hydration compatibility with Astro islands (`client:load`, `client:visible`, `client:idle`). Components avoid unguarded `window` or `document` calls during SSR.

---

## REQ-006: Layout Templates & Widgets (feature UI-DASH-01)

- **Category:** Functional
- **Priority:** P2
- **SRS Status:** `active`
- **Feature Status:** `completed`
- **Files:** `src/components/DashboardLayout.svelte`, `src/components/GlobalTicker.svelte`, `src/components/Landing.svelte`, `src/components/AppShell.svelte`

High-level application layout templates including `DashboardLayout`, telemetry `GlobalTicker`, `Landing` page showcase, and responsive `AppShell` with mobile navigation integration.
