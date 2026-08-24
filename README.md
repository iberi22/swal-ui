# @swal/ui

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-orange.svg)](https://svelte.dev)

> Edge-Hive theme tokens and Svelte 5 runes-based UI components powering SouthWest AI Labs (SWAL) web applications.

`@swal/ui` is the official design system for SouthWest AI Labs (SWAL). Built from the ground up for **Svelte 5** using modern runes (`$state`, `$derived`, `$props`, `$bindable`, `$effect`), it provides a zero-dependency, scoped-CSS component library and framework-agnostic CSS design tokens ("Hive Dark" theme).

---

## Features

- ⚡ **Svelte 5 Runes Native**: Built using Svelte 5 reactivity runes without legacy store dependencies.
- 🎨 **Hive Theme Tokens**: CSS custom properties for slate dark-mode UI, vibrant cyan/orange accents, and neon indicators.
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

`@swal/ui` uses framework-agnostic CSS variables defined in `:root`. To use the theme across your application, import the stylesheet into your app's main entry point (`+layout.svelte`, `main.ts`, `layout.astro`, or index stylesheet).

### Token Files

Theme definitions are located under `src/tokens/`:

- `src/tokens/theme.css`: Main dark theme tokens (Slate 950 base, Hive accents, layout dimensions). Automatically imports `colors.css`.
- `src/tokens/colors.css`: Color palette custom properties (`--swal-bg`, `--swal-accent`, `--swal-accent-orange`, `--swal-text`, etc.).
- `src/tokens/tikpro.css`: Specialized color token overrides and CRT scanline effects for telemetry screens.
- `src/tokens/index.ts`: TypeScript constants and design token helper functions for programmatic access.
- `src/tokens/tailwind.ts`: Tailwind CSS theme extension object for seamless integration with Tailwind projects.

### Standard Import

```css
/* Import in global CSS or root layout */
@import '@swal/ui/tokens';
```

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

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for full details.

---

*SouthWest AI Labs (SWAL) · Edge-Hive Theme & Svelte 5 UI Component Library*
