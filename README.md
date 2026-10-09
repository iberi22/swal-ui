# @swal/ui

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-orange.svg)](https://svelte.dev)

> Bone theme tokens and Svelte 5 runes-based UI components powering SouthWest AI Labs (SWAL) web applications.

`@swal/ui` is the official design system for SouthWest AI Labs (SWAL). Built from the ground up for **Svelte 5** using modern runes (`$state`, `$derived`, `$props`, `$bindable`, `$effect`), it provides a zero-dependency, scoped-CSS component library and framework-agnostic CSS design tokens (the Bone theme by default).

---

## Features

- ⚡ **Svelte 5 Runes Native**: Built using Svelte 5 reactivity runes without legacy store dependencies.
- 🎨 **Bone Theme Tokens**: CSS custom properties for the warm-minimalist palette — bone white and warm mineral dark, stone borders, accessibility-measured status colours.
- 🚀 **Zero Dependencies**: Lightweight UI primitives styled with scoped CSS.
- 🏝️ **Astro Islands Compatible**: Full SSR and hydration support with Astro (`client:load`, `client:visible`).
- 🛠️ **TypeScript & Tailwind Support**: Pre-configured token exports for TypeScript definitions (`src/tokens/index.ts`) and Tailwind CSS integration (`src/tokens/tailwind.ts`).

---

## Install

Install `@swal/ui` into your project using `pnpm` or `npm`:

```bash
# Using pnpm (SWAL standard)
pnpm add @swal/ui

# Using npm
npm install @swal/ui
```

### Peer Dependencies

Ensure your project has Svelte 5 installed:

```json
"peerDependencies": {
  "svelte": "^5.0.0"
}
```

---

## Components

The design system exports 18 reusable Svelte 5 components located under `src/components/`:

| Component | File Path | Description / Purpose |
|-----------|-----------|-----------------------|
| `Badge` | `Badge.svelte` | Status indicator tag supporting variants (`success`, `warning`, `danger`, `info`, `neutral`, `orange`) and optional pulse effect. |
| `Button` | `Button.svelte` | Interactive button supporting primary (cyan), orange, outline, ghost, and danger variants with optional glow effect. |
| `Card` | `Card.svelte` | Flexible container surface with customizable elevation, translucency (`default`, `surface`, `elevated`, `glass`), and hover effects. |
| `CommandPalette` | `CommandPalette.svelte` | Keyboard-driven `Ctrl+K` overlay for fast search, action dispatching, and application navigation. |
| `ConfigEditor` | `ConfigEditor.svelte` | Schema-driven interactive JSON/form editor for real-time configuration mutation. |
| `DashboardLayout` | `DashboardLayout.svelte` | Full application shell incorporating collapsible sidebar navigation, header branding, and integrated status ticker. |
| `GlobalTicker` | `GlobalTicker.svelte` | Marquee marquee status bar for live telemetry alerts, system notifications, and announcements. |
| `Input` | `Input.svelte` | Scoped-styled form input control with bi-directional `$bindable` value binding and focus state indicators. |
| `Landing` | `Landing.svelte` | Hero section template with customizable badge, main title, subtitle, call-to-action buttons, and preview slots. |
| `LoadingState` | `LoadingState.svelte` | Status loading indicator featuring an animated spinner or inline error feedback with an optional retry trigger. |
| `LogViewer` | `LogViewer.svelte` | High-performance streaming log viewer component supporting level filtering (`debug`, `info`, `warn`, `error`) and auto-scrolling. |
| `Modal` | `Modal.svelte` | Accessible dialog modal with backdrop blur, keydown escape handling, and smooth scale transitions. |
| `Skeleton` | `Skeleton.svelte` | Loading placeholder skeleton animation supporting `text`, `card`, and `circle` shapes. |
| `StatusBadge` | `StatusBadge.svelte` | Operational status indicator for node health (`healthy`, `warning`, `error`, `offline`) with neon glow pulse animations. |
| `Table` | `Table.svelte` | Flexible data table supporting custom column alignments, sort headers, and custom cell rendering snippets. |
| `Tabs` | `Tabs.svelte` | Tabbed interface component with smooth active state indicators and dynamic content switching. |
| `Terminal` | `Terminal.svelte` | Interactive developer terminal interface displaying timestamped logs, severity levels, and command history. |
| `Toaster` | `Toaster.svelte` | Global toast notification container rendering stacked feedback toasts managed by `@swal/ui/toast`. |

---

## Theming

`@swal/ui` uses framework-agnostic CSS variables. **Bone is the theme**: it applies with no configuration, and every app gets the same look unless it asks for something else.

The "Bone Taller" accent layer lives in `src/tokens/bone-taller.css` (Bone stone neutrals + the Taller orange `#FF6A13` as the single accent). Activate it with `data-accent="taller"` on `<html>`; it is also the source of the Flutter package tokens.

### Standard Import

One entry point. Do not import the token files directly — each app that picks its own file is how the ecosystem ended up with three different selector conventions and a theme that silently overrode everything.

```css
/* In your global CSS or root layout */
@import '@swal/ui/themes.css';
```

That gives you Bone plus the utilities: `.swal-glass` (translucent surface), `.swal-mesh-bg` (warm ambient gradient), `.swal-meta` (monospace metadata, keyboard hints, figures).

### Component Styles

`themes.css` above is **tokens only** — variables, not the rules that style the
components. The component stylesheet is a separate import:

```css
@import '@swal/ui/themes.css';   /* tokens: --swal-*, Bone, utilities */
@import '@swal/ui/ui.css';      /* rules: .swal-btn, .swal-card, ... */
```

**You need both.** Importing only the tokens gives you every variable defined
and every component unstyled: `<Button>` renders with its correct class names
and **zero matching rules**, so it looks like a native browser button
(`padding: 1px 6px`, 13px, no radius) instead of the design system's.

This bites hardest in `astro dev`, where Vite externalizes the package and the
scoped CSS of a Svelte component used **without** a `client:*` directive is
never injected — the component renders as static HTML with no styles. Import
`ui.css` globally and it applies in every mode.

### Switching Theme

```html
<html data-theme="light">
```

```js
document.documentElement.dataset.theme = 'light';   // at runtime
```

`data-theme` accepts `dark` (default), `light`, and `tikpro`. With no attribute, Bone follows `prefers-color-scheme`.

### Token Files

Under `src/tokens/`, imported by `themes.css` — reach them only through it:

| File | Contents |
|---|---|
| `src/tokens/theme.css` | Bone: the colour and geometry contract, `[data-theme='dark']` and `[data-theme='light']` |
| `src/tokens/colors.css` | Raw palette custom properties |
| `src/tokens/tikpro.css` | `tikpro` overrides for telemetry screens |
| `src/tokens/taller.css` | Taller dual theme: `claro` (flat technical) / `garaje` (dark) |
| `src/tokens/antigravity.css` | `antigravity` and `antigravity-light` |
| `src/tokens/fonts.css` | Font stacks |

`src/themes.css` is the registry; `src/tokens/*` are its inputs.

### Theme Mode and Preferences

For a UI that follows the operating system — or lets the reader choose — import
the mode helpers:

```js
import { THEME_MODES, getThemeMode, setThemeMode } from '@swal/ui/theme-mode';
```

| Export | Purpose |
|---|---|
| `THEME_MODES` | `['light', 'dark', 'system']` |
| `THEME_MODE_KEY` | `'swal:theme-mode'` — the storage key |
| `getThemeMode()` | reads the stored mode |
| `setThemeMode(mode)` | persists it |
| `themeModeScript(opts)` | inline script to apply the mode before first paint |

Interface preferences that live alongside it, under `@swal/ui/prefs`:

| Export | Purpose |
|---|---|
| `prefsBootstrapScript(opts)` | inline script, applies stored prefs before first paint |
| `resolvePrefs(prefs)` | resolves stored prefs against the current environment |
| `createPrefsStore()` | reactive store (`get` / `set` / `reset`) |
| `defaultPrefs` | the shipped defaults |
| `applyPreset(name)` | applies a named preset |
| `isModuleEnabled` / `isPanelEnabled` | feature toggles |
| `moduleGroups` / `panelOption` / `panelScopes` | the module and panel taxonomy |
| `PREFS_EVENT` | DOM event the store emits on change |

Components: `OnboardingWizard`, `PrefsEditor`, `ThemeModeSwitch`.

### Contract and auditing

A theme must define the full semantic token set — `--swal-bg`, `--swal-surface`, `--swal-text`, `--swal-text-secondary`, `--swal-text-muted`, `--swal-border`, `--swal-accent`, `--swal-accent-contrast`, `--swal-success`, `--swal-warning`, `--swal-danger`. Typography and geometry (`--swal-font`, `--swal-font-mono`, `--swal-radius`) live once in the base layer, not per theme.

```bash
pnpm run check              # contract + WCAG AA, both modes
pnpm run themes:ecosistema  # also flags apps importing token files by hand
```

Bone passes 16/16 pairs (lowest: 4.58:1, danger on background in light mode). If a theme you write does not pass AA, the theme is wrong — not the auditor.

### Tailwind

`src/tokens/tailwind.ts` maps the tokens into a Tailwind theme object for Tailwind projects.

### Key Design Variables

| CSS Variable | Default Value | Usage |
|--------------|---------------|-------|
| `--swal-bg` | `#020617` | Main canvas background |
| `--swal-elevated` | `#0f172a` | Panels, sidebars, modal surfaces |
| `--swal-elevated-850` | `#151e2e` | Elevated card surfaces |
| `--swal-void` | `#000000` | Terminal background / void black |
| `--swal-accent` | `#06b6d4` | Primary action cyan accent |
| `--swal-accent-orange` | `#f97316` | System notification & warning orange |
| `--swal-text` | `#f1f5f9` | Primary readable text |
| `--swal-text-secondary` | `#94a3b8` | Subtitles and meta text |
| `--swal-success` | `#10b981` | Success indicators |
| `--swal-warning` | `#f59e0b` | Warning indicators |
| `--swal-danger` | `#ef4444` | Danger & error indicators |

---

## Usage Examples

### Svelte 5

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

  <Button variant="primary" glow onclick={() => console.log('Connecting...')}>
    Connect Node
  </Button>
</Card>
```

### Astro Islands

```astro
---
import { Button, StatusBadge } from '@swal/ui';
---

<div class="status-container">
  <StatusBadge status="healthy" label="Cluster Online" />
  <!-- Hydrated client-side -->
  <Button client:load variant="orange">Action</Button>
</div>
```

---

## Flutter package (`flutter/`)

The same design system for Flutter lives in [`flutter/`](./flutter/README.md) as the Dart
package `swal_ui` (Material 3 `ThemeData` + widgets, "Bone Taller" theme, light / dark / system).
Its colors, radii, spacing, shadows and durations are **generated** from the CSS tokens, so web
and Flutter cannot drift:

```bash
pnpm gen:flutter   # src/tokens/{theme,bone-taller,taller}.css -> flutter/lib/src/tokens.g.dart
```

`tests/flutter-tokens.test.js` (part of `pnpm test`) fails if the generated Dart file is stale.
Install it in an app as a git dependency:

```yaml
dependencies:
  swal_ui:
    git:
      url: https://github.com/iberi22/swal-ui
      path: flutter
      ref: <tag-or-sha>
```

---

## License

This package is licensed under the **Apache License 2.0** — see [LICENSE](./LICENSE).

Apache-2.0 was chosen over MIT/AGPL for a design system meant to be adopted:
it is permissive like MIT (no copyleft, no obligation to open your service)
**plus** it grants an explicit patent licence and states the patent
termination clause, which matters for a package with a dozen organisations
building on it.

See also [NOTICE](./NOTICE) for attribution.

---

*SouthWest AI Labs (SWAL) · Bone Theme & Svelte 5 UI Component Library*
