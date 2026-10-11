# @swal/ui

[![npm version](https://img.shields.io/npm/v/@swal/ui.svg)](https://www.npmjs.com/package/@swal/ui)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-orange.svg)](https://svelte.dev)

> Bone theme design tokens and Svelte 5 runes-based UI components powering SouthWest AI Labs (SWAL) web applications.

`@swal/ui` is the official design system for SouthWest AI Labs (SWAL). Built from the ground up for **Svelte 5** using modern reactivity runes (`$state`, `$derived`, `$props`, `$bindable`, `$effect`), it provides a zero-dependency, scoped-CSS component library and framework-agnostic CSS design tokens (the Bone theme by default).

---

## Features

- ⚡ **Svelte 5 Runes Native**: Built purely with Svelte 5 runes without legacy Svelte store dependencies.
- 🎨 **Bone Theme Tokens**: CSS custom properties for the warm-minimalist palette — Alabaster Paper (`#FAF9F5`) and Mineral Charcoal (`#121211`), tactile glass, stone borders, and accessibility-verified status indicators.
- 🚀 **Zero Runtime Dependencies**: Lightweight UI primitives styled with scoped CSS.
- 🏝️ **Astro Islands Compatible**: Full SSR safety and hydration compatibility with Astro (`client:load`, `client:visible`).
- ♿ **Strict Accessibility**: All semantic color pairings pass WCAG 2.2 AA contrast checks. Includes keyboard focus rings, ARIA labels, and focus-trapped dialogs.
- 🛠️ **TypeScript & Tailwind Support**: Pre-configured token definitions and Tailwind integration maps.
- 📱 **Cross-Platform Parity**: Official Flutter companion package (`swal_ui`) generated directly from CSS tokens.

---

## Installation

Install `@swal/ui` into your project using `npm` or `pnpm`:

```bash
# Using npm
npm install @swal/ui

# Using pnpm (SWAL standard)
pnpm add @swal/ui
```

### Peer Dependencies

Ensure your project has Svelte 5 installed:

```json
"peerDependencies": {
  "svelte": "^5.0.0"
}
```

---

## Quick Start

### 1. Global Stylesheet Imports

In your global CSS file or root HTML template (e.g. `layout.astro` or `+layout.svelte`), import both the design tokens and component styles:

```css
@import '@swal/ui/themes.css'; /* CSS variables: --swal-*, Bone theme, utilities */
@import '@swal/ui/ui.css';     /* Scoped component rules (.swal-btn, .swal-card) */
```

> **Note:** Both imports are required. `themes.css` supplies tokens and custom properties, while `ui.css` provides the component rule definitions.

### 2. Usage in Svelte 5

```svelte
<script>
  import { Button, Card, StatusBadge, Input } from '@swal/ui';

  let nodeName = $state('edge-node-01');
  let status = $state('healthy');
</script>

<Card variant="elevated">
  <h3>System Status</h3>
  <StatusBadge {status} label={nodeName} />

  <Input bind:value={nodeName} placeholder="Enter node alias" />

  <Button variant="primary" onclick={() => console.log('Connecting...')}>
    Connect Node
  </Button>
</Card>
```

### 3. Usage in Astro Islands

```astro
---
import { Button, StatusBadge, Card } from '@swal/ui';
---

<Card variant="elevated">
  <StatusBadge status="healthy" label="Cluster Online" />
  <!-- Hydrated client-side -->
  <Button client:load variant="primary">Execute Command</Button>
</Card>
```

---

## Components

`@swal/ui` exports 27 reusable Svelte 5 components under `src/components/index.js`:

| Component | Source File | Description / Purpose |
|---|---|---|
| `AppShell` | `AppShell.svelte` | Responsive application layout shell with header, sidebar navigation, and main content area. |
| `BackupPanel` | `BackupPanel.svelte` | Offline-first backup management interface supporting JSON export, download, validation, and restoration. |
| `Badge` | `Badge.svelte` | Compact label indicator for categories, tags, or count indicators. |
| `Button` | `Button.svelte` | Versatile button component supporting `primary`, `secondary`, `ghost`, and `danger` variants. |
| `Card` | `Card.svelte` | Elevated content container supporting `default`, `elevated`, and `interactive` card variants. |
| `CommandPalette` | `CommandPalette.svelte` | Keyboard-accessible command dialog (Ctrl+K / Cmd+K) with fuzzy search filtering. |
| `ConfigEditor` | `ConfigEditor.svelte` | Interactive form editor with real-time JSON synchronization and validation. |
| `DashboardLayout` | `DashboardLayout.svelte` | Responsive multi-column dashboard grid layout for operations and telemetry panels. |
| `GlobalTicker` | `GlobalTicker.svelte` | High-visibility metric and telemetry stream ticker ribbon. |
| `Icon` | `Icon.svelte` | Lightweight inline SVG icon renderer integrated with the package icon registry. |
| `Input` | `Input.svelte` | Accessible text input with label support, validation states, and prefix/suffix slots. |
| `Landing` | `Landing.svelte` | Full-width marketing hero and product showcase landing template. |
| `LoadingState` | `LoadingState.svelte` | Skeleton placeholder and spinning loader indicator for asynchronous content. |
| `LogViewer` | `LogViewer.svelte` | Virtualized real-time log viewer console with level filtering and search. |
| `MobileNav` | `MobileNav.svelte` | Touch-optimized bottom navigation bar and slide-out drawer for mobile devices. |
| `Modal` | `Modal.svelte` | Dialog modal with backdrop blur, focus trapping, and background scroll locking. |
| `OnboardingWizard` | `OnboardingWizard.svelte` | Multi-step interactive onboarding flow for user preferences and setup. |
| `PrefsEditor` | `PrefsEditor.svelte` | Schema-driven preferences and panel configuration editor. |
| `QRCode` | `QRCode.svelte` | Zero-dependency SVG QR code visualizer with accessible labelling. |
| `Skeleton` | `Skeleton.svelte` | Animated placeholder bone indicating content loading state. |
| `StatusBadge` | `StatusBadge.svelte` | Real-time status badge reflecting node health (`healthy`, `warning`, `error`, `offline`). |
| `StorageStatus` | `StorageStatus.svelte` | Offline-first quota and persistent storage status monitor. |
| `Table` | `Table.svelte` | Structured tabular data viewer with responsive columns and sortable headers. |
| `Tabs` | `Tabs.svelte` | Accessible tabbed navigation interface with keyboard tab-switching. |
| `Terminal` | `Terminal.svelte` | Interactive developer terminal emulator with timestamped logs and command execution. |
| `ThemeModeSwitch` | `ThemeModeSwitch.svelte` | Toggle switch for selecting light, dark, or system theme mode. |
| `Toaster` | `Toaster.svelte` | Global toast notification container rendering stacked feedback toasts managed by `@swal/ui/toast`. |

---

## Theming

`@swal/ui` uses framework-agnostic CSS variables. **Bone is the default theme**: it applies with no configuration, ensuring consistency across SWAL applications.

The **Bone Taller** accent layer lives in `src/tokens/bone-taller.css` (Bone stone neutrals + Taller signal orange `#FF6A13` as the single accent). Activate it with `data-accent="taller"` on `<html>`.

### Switching Themes

Themes can be toggled via the `data-theme` attribute on `<html>` or `<body>`:

```html
<html data-theme="light">
```

```javascript
document.documentElement.dataset.theme = 'light';
```

Supported theme identifiers:
- `dark` (Bone dark / Mineral Charcoal — default)
- `light` (Bone light / Alabaster Paper)
- `taller` (Taller technical blueprint light)
- `taller-dark` (Taller technical blueprint dark)
- `tikpro` (High-contrast sci-fi telemetry)
- `antigravity` / `antigravity-light` (Antigravity workspace theme)

### Theme Mode Utilities

To synchronize theme modes with operating system preferences without layout shifts or flashes:

```javascript
import { THEME_MODES, getThemeMode, setThemeMode, themeModeScript } from '@swal/ui/theme-mode';
```

In your Astro `<head>` or HTML document:
```html
<script is:inline set:html={themeModeScript()} />
```

### Key Design Tokens

| CSS Variable | Default Dark Value | Usage |
|---|---|---|
| `--swal-bg` | `#121211` | Main viewport canvas background |
| `--swal-surface` | `rgba(28, 25, 23, 0.85)` | Primary card and container surfaces |
| `--swal-elevated` | `#1c1917` | Modals, flyouts, and elevated panels |
| `--swal-border` | `rgba(255, 255, 255, 0.08)` | Standard component border |
| `--swal-accent` | `#d97706` / `#ff6a13` | Primary accent color |
| `--swal-text` | `#f5f5f4` | High-contrast primary text |
| `--swal-text-secondary` | `#a8a29e` | Secondary body text and labels |
| `--swal-text-muted` | `#78716c` | Subdued metadata and placeholder text |
| `--swal-success` | `#10b981` | Success status indicators |
| `--swal-warning` | `#f59e0b` | Warning status indicators |
| `--swal-danger` | `#ef4444` | Destructive actions and error indicators |

---

## Accessibility

`@swal/ui` is built according to **WCAG 2.2 AA** accessibility guidelines:
- **Contrast Ratios:** All semantic background/text pairs are validated (passing the 4.5:1 minimum threshold). Run `pnpm run check` to execute the automated theme contrast auditor.
- **Keyboard Navigation:** Full keyboard navigation support in `CommandPalette`, `Tabs`, `Modal`, `Table`, and interactive inputs.
- **Focus Management:** Visible focus rings (`--swal-focus-ring`) and automatic focus trapping in modal dialogs.
- **Reduced Motion:** Honors `prefers-reduced-motion` across all CSS transitions and animations.

---

## Browser Support

`@swal/ui` targets modern evergreen web browsers:
- Google Chrome / Chromium >= 100
- Mozilla Firefox >= 100
- Apple Safari >= 16
- Microsoft Edge >= 100

Requires native browser support for CSS Custom Properties, CSS Grid, Flexbox, and ES2022 JavaScript modules.

---

## Flutter Package (`flutter/`)

The design system also ships for Flutter under [`flutter/`](./flutter/README.md) as the Dart package `swal_ui` (Material 3 `ThemeData` + widgets, Bone Taller theme). Design tokens are automatically synchronized from CSS tokens using `pnpm gen:flutter`.

```yaml
dependencies:
  swal_ui:
    git:
      url: https://github.com/iberi22/swal-ui
      path: flutter
      ref: <tag-or-commit>
```

---

## Documentation Links

- [Usage Manual & Component Examples (USAGE.md)](./USAGE.md)
- [Architecture & Source Tree (SRC.md)](./SRC.md)
- [Functional Requirements (docs/SRS/REQUIREMENTS.md)](./docs/SRS/REQUIREMENTS.md)
- [Autonomous Agent Guidelines (AGENTS.md)](./AGENTS.md)
- [Flutter Companion Package (flutter/README.md)](./flutter/README.md)

---

## License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](./LICENSE) file for details.

Apache-2.0 provides permissive open-source usage alongside explicit patent grants and protective patent termination clauses. See also [NOTICE](./NOTICE) for required attribution notices.

---

*SouthWest AI Labs (SWAL) · Bone Theme & Svelte 5 UI Component Library*
