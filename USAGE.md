# @swal/ui — Usage Manual

> Unified design system of the SouthWest AI Labs (SWAL) ecosystem.
> Default Theme: **Bone** (Alabaster Paper / Mineral Charcoal).
> **Svelte 5 (Runes) · Zero Runtime Dependencies · Scoped CSS** — Tailwind optional.

---

## Installation

Install `@swal/ui` via npm or pnpm:

```bash
# Using npm
npm install @swal/ui

# Using pnpm
pnpm add @swal/ui
```

Within a pnpm workspace:

```json
{
  "dependencies": {
    "@swal/ui": "workspace:*"
  }
}
```

### Global Stylesheet Setup

Import tokens and component styles in your application entry point (`main.ts`, `Layout.astro`, or `+layout.svelte`):

```css
@import '@swal/ui/themes.css'; /* Tokens: --swal-*, Bone theme, utilities */
@import '@swal/ui/ui.css';     /* Scoped component rules (.swal-btn, .swal-card, etc.) */
```

> **Important:** Both imports are required. `themes.css` declares custom properties and theme definitions, while `ui.css` contains the styling rules for all exported components.

---

## Design Tokens

Core CSS custom properties declared in `:root`:

| Token | Default Dark | Description |
|---|---|---|
| `--swal-bg` | `#121211` | Primary background canvas (Mineral Charcoal) |
| `--swal-surface` | `rgba(28, 25, 23, 0.85)` | Card and surface container fill |
| `--swal-surface-hover` | `rgba(41, 37, 36, 0.7)` | Surface hover state |
| `--swal-surface-active` | `rgba(68, 64, 60, 0.5)` | Active state / pressed surface |
| `--swal-elevated` | `#1c1917` | Elevated elements (modals, dropdowns) |
| `--swal-overlay` | `rgba(0, 0, 0, 0.75)` | Modal and backdrop blur overlay |
| `--swal-border` | `rgba(255, 255, 255, 0.08)` | Standard component border |
| `--swal-border-light` | `rgba(255, 255, 255, 0.14)` | Highlighted / active border |
| `--swal-accent` | `#ff6a13` / `#d97706` | Primary action accent color |
| `--swal-accent-contrast`| `#1c1917` | High-contrast text on accent surfaces |
| `--swal-accent-muted` | `rgba(255, 106, 19, 0.12)` | Subtle accent tinted background |
| `--swal-success` | `#10b981` | Success state indicator |
| `--swal-warning` | `#f59e0b` | Warning state indicator |
| `--swal-danger` | `#ef4444` | Destructive action and error indicator |
| `--swal-text` | `#f5f5f4` | High-contrast primary readable text |
| `--swal-text-secondary` | `#a8a29e` | Secondary body text and labels |
| `--swal-text-muted` | `#78716c` | Subdued metadata and disabled text |
| `--swal-font` | `Inter, system-ui, sans-serif` | Default typography stack |
| `--swal-font-mono` | `Fira Code, JetBrains Mono, monospace` | Monospace code and terminal font |
| `--swal-radius` / `-sm` / `-lg` | `8px` / `4px` / `12px` | Corner radii |
| `--swal-transition-fast` / `-slow` | `150ms` / `300ms` | Standard animation durations |

### Utility Classes

The library provides shared utility classes for consistent interfaces:

- `.swal-glass`: Translucent surface with `backdrop-filter: blur(12px)` and stone border.
- `.swal-mesh-bg`: Ambient gradient canvas background.
- `.swal-meta`: Monospaced typography for metrics, metadata, keyboard shortcuts, and IDs.
- `.swal-chamfer` / `.swal-chamfer-sm` / `.swal-chamfer-lg`: Clipped corners for blueprint aesthetics.
- `.swal-card-frame` + `.swal-card-inner`: 1px bordered blueprint card container.
- `.swal-scrollbar`: Industrial custom scrollbar matching theme surface tokens.
- `.swal-crt`: Subtle CRT scanline animation overlay for terminal screens.

---

## Component Guide

### `<Button>`

Button primitive with variant styling, glowing focus effects, and loading indicators.

```svelte
<script>
  import { Button } from '@swal/ui';
</script>

<Button variant="primary" onclick={() => alert('Clicked')}>
  Primary Action
</Button>

<Button variant="secondary" size="sm">
  Secondary
</Button>

<Button variant="danger" loading={false}>
  Delete Item
</Button>

<Button variant="ghost" glow>
  Glowing Ghost
</Button>
```

Props:
- `variant`: `'primary' | 'secondary' | 'ghost' | 'danger'` (default: `'secondary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `loading`: `boolean` (default: `false`)
- `disabled`: `boolean` (default: `false`)
- `glow`: `boolean` (default: `false`)
- `type`: `'button' | 'submit' | 'reset'` (default: `'button'`)

---

### `<Card>`

Structural container with glassmorphism and elevation support.

```svelte
<script>
  import { Card } from '@swal/ui';
</script>

<Card variant="elevated" hover>
  <h3>System Metrics</h3>
  <p>Cluster load is within normal thresholds.</p>
</Card>
```

Props:
- `variant`: `'default' | 'elevated' | 'glass'` (default: `'default'`)
- `hover`: `boolean` — Enables hover elevation and border transition (default: `false`)
- `padding`: `'none' | 'sm' | 'md' | 'lg'` (default: `'md'`)

---

### `<Badge>`

Compact label for entity states, tags, or counts.

```svelte
<script>
  import { Badge } from '@swal/ui';
</script>

<Badge variant="success">Active</Badge>
<Badge variant="warning" dot>Syncing</Badge>
<Badge variant="danger">Failed</Badge>
```

Props:
- `variant`: `'default' | 'accent' | 'success' | 'warning' | 'danger'` (default: `'default'`)
- `dot`: `boolean` — Renders a pulsing status indicator dot (default: `false`)
- `size`: `'sm' | 'md'` (default: `'md'`)

---

### `<StatusBadge>`

Node and cluster operational health badge.

```svelte
<script>
  import { StatusBadge } from '@swal/ui';
</script>

<StatusBadge status="healthy" label="Node 01" />
<StatusBadge status="warning" label="High Latency" pulse />
<StatusBadge status="error" label="Unreachable" />
<StatusBadge status="offline" label="Standby" />
```

Props:
- `status`: `'healthy' | 'warning' | 'error' | 'offline'` (required)
- `label`: `string` (optional)
- `pulse`: `boolean` (default: `false`)

---

### `<Modal>`

Accessible dialog modal featuring focus trapping, backdrop blur, and body scroll lock.

```svelte
<script>
  import { Modal, Button } from '@swal/ui';

  let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Open Settings</Button>

<Modal bind:open title="Configuration" size="md">
  <p>Modify your cluster preferences here.</p>
  {#snippet footer()}
    <Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
    <Button variant="primary" onclick={() => (open = false)}>Save</Button>
  {/snippet}
</Modal>
```

---

### Toasts: `<Toaster>` & `toast`

Runes-native toast notifications.

```svelte
<script>
  import { Toaster, Button } from '@swal/ui';
  import { toast } from '@swal/ui/toast';

  function trigger() {
    toast.success('Configuration saved successfully');
    // toast.error('Connection timeout');
    // toast.warning('High memory utilization');
    // toast.info('New release available');
  }
</script>

<!-- Place once in your root layout -->
<Toaster position="top-right" />

<Button onclick={trigger}>Show Toast</Button>
```

---

### `<CommandPalette>`

Keyboard-first command palette dialog with quick actions and filtering.

```svelte
<script>
  import { CommandPalette } from '@swal/ui';

  let open = $state(false);

  const actions = [
    { id: '1', title: 'Deploy Cluster', section: 'Actions', shortcut: '⌘D', run: () => console.log('Deploy') },
    { id: '2', title: 'Open Settings', section: 'Navigation', shortcut: '⌘,', run: () => console.log('Settings') }
  ];
</script>

<CommandPalette bind:open items={actions} placeholder="Type a command..." />
```

---

### `<Terminal>`

Developer terminal console with command execution and log output.

```svelte
<script>
  import { Terminal } from '@swal/ui';

  let logs = $state([
    { timestamp: '12:00:01', text: 'Initializing node...', level: 'info' },
    { timestamp: '12:00:02', text: 'Connected to mesh network', level: 'success' }
  ]);
</script>

<Terminal {logs} title="SWAL Edge Node" onCommand={(cmd) => console.log(cmd)} />
```

---

### `<LogViewer>`

High-volume log viewer with level filtering, timestamp toggles, and autoscroll.

```svelte
<script>
  import { LogViewer } from '@swal/ui';

  let lines = $state([
    { timestamp: '2026-10-11T00:00:00Z', level: 'info', message: 'Daemon started' },
    { timestamp: '2026-10-11T00:00:01Z', level: 'warn', message: 'Peer reconnecting' }
  ]);
</script>

<LogViewer {lines} autoscroll filterLevel="all" />
```

---

### `<ConfigEditor>`

Interactive configuration key-value form with raw JSON validation.

```svelte
<script>
  import { ConfigEditor } from '@swal/ui';

  let config = $state({
    clusterId: 'swal-01',
    maxPeers: 32,
    telemetry: true
  });
</script>

<ConfigEditor value={config} onchange={(updated) => (config = updated)} />
```

---

### `<LoadingState>`

Asynchronous loading indicator and skeleton wrapper.

```svelte
<script>
  import { LoadingState } from '@swal/ui';
</script>

<LoadingState message="Connecting to peer mesh..." />
```

---

### `<Table>`

Responsive table with sortable columns and zebra row striping.

```svelte
<script>
  import { Table } from '@swal/ui';

  const columns = [
    { key: 'id', label: 'Node ID', sortable: true },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' }
  ];

  const rows = [
    { id: 'node-alpha', role: 'validator', status: 'online' },
    { id: 'node-beta', role: 'relay', status: 'syncing' }
  ];
</script>

<Table {columns} data={rows} striped />
```

---

### `<Tabs>`

Accessible tab switcher with keyboard navigation.

```svelte
<script>
  import { Tabs } from '@swal/ui';

  let activeTab = $state('overview');

  const items = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'logs', label: 'Logs' }
  ];
</script>

<Tabs {items} bind:selected={activeTab} />
```

---

### `<Input>`

Text input supporting labels, validation messages, and icons.

```svelte
<script>
  import { Input } from '@swal/ui';

  let query = $state('');
</script>

<Input
  bind:value={query}
  label="Search Nodes"
  placeholder="Enter node ID or IP..."
  error=""
/>
```

---

### `<Skeleton>`

Placeholder skeleton loader.

```svelte
<script>
  import { Skeleton } from '@swal/ui';
</script>

<Skeleton width="100%" height="24px" />
<Skeleton width="60%" height="16px" />
```

---

### `<DashboardLayout>`

Multi-column layout structure with header, sidebar, and content area.

```svelte
<script>
  import { DashboardLayout } from '@swal/ui';
</script>

<DashboardLayout>
  {#snippet sidebar()}
    <nav>Sidebar Navigation</nav>
  {/snippet}

  <main>Dashboard Content</main>
</DashboardLayout>
```

---

### App Shell (`Icon`, `MobileNav`, `AppShell`)

Composable, unbranded application shell extracted from production SWAL apps.

```svelte
<script>
  import { AppShell, Icon, MobileNav } from '@swal/ui';

  const navItems = [
    { href: '/', label: 'Overview', icon: 'home' },
    { href: '/nodes', label: 'Nodes', icon: 'server' },
    { href: '/settings', label: 'Settings', icon: 'settings' }
  ];
</script>

<AppShell brand="SWAL Mesh" {navItems}>
  <h1>Cluster Overview</h1>
</AppShell>
```

---

### `<GlobalTicker>`

Real-time metric ticker ribbon for telemetry streams.

```svelte
<script>
  import { GlobalTicker } from '@swal/ui';

  const items = [
    { label: 'BLOCK', value: '#1,489,203' },
    { label: 'TPS', value: '4,280' },
    { label: 'PEERS', value: '184' }
  ];
</script>

<GlobalTicker {items} />
```

---

### `<Landing>`

Showcase landing page template with hero section, feature grid, and CTA banner.

```svelte
<script>
  import { Landing } from '@swal/ui';
</script>

<Landing
  title="Autonomous Agent Infrastructure"
  subtitle="Sovereign AI workflows, decentralized edge mesh, and zero-dependency design system."
/>
```

---

### `<QRCode>`

Zero-dependency SVG QR code visualizer with accessible labelling.

```svelte
<script>
  import { QRCode } from '@swal/ui';
</script>

<QRCode value="https://swal.ai" size={160} title="SWAL Portal QR Code" />
```

---

## Motion Transitions

Svelte transitions customized for the Bone design system:

```svelte
<script>
  import { swalFade, swalSlide } from '@swal/ui/motion';

  let visible = $state(true);
</script>

{#if visible}
  <div transition:swalFade={{ duration: 200 }}>
    Fade Transition
  </div>
  <div transition:swalSlide={{ duration: 300 }}>
    Slide Transition
  </div>
{/if}
```

---

## Astro Islands Integration

`@swal/ui` components are fully compatible with Astro islands and support server-side rendering (SSR).

### Hydration Directives

```astro
---
import { Button, StatusBadge, Modal } from '@swal/ui';
---

<!-- Static SSR render (zero client JavaScript) -->
<StatusBadge status="healthy" label="Cluster 01" />

<!-- Hydrated immediately on page load -->
<Button client:load variant="primary">Immediate Action</Button>

<!-- Hydrated when scrolled into viewport -->
<Modal client:visible title="Delayed Dialog">
  <p>Content loaded on demand.</p>
</Modal>
```

### Island Compatibility Guidelines

- All components are SSR-safe: browser globals (`window`, `document`, `localStorage`) are never called at the script top level.
- Always import `@swal/ui/themes.css` and `@swal/ui/ui.css` in your Astro root layout (`Layout.astro`).

---

## Theming

### Bone Theme (Default)

The default theme is **Bone** (Alabaster Paper / Mineral Charcoal). No special attribute is required, but it can be explicitly set:

```html
<html data-theme="dark"> <!-- or "light" -->
```

### Bone Taller Accent Layer

Combines Bone neutrals with the Taller signal orange (`#FF6A13`) accent:

```css
@import '@swal/ui/tokens';
@import '@swal/ui/bone-taller.css';
```

```html
<html data-accent="taller" data-theme="light">
```

### Taller Blueprint Theme

A technical drawing aesthetic featuring architectural grid lines, chamfered corners, and signal orange highlights:

```css
@import '@swal/ui/tokens';
@import '@swal/ui/taller.css';
```

```html
<html data-theme="taller"> <!-- or "taller-dark" -->
```

### Typography Presets (`data-font`)

Four opt-in typography presets configured via `data-font`:

| Preset | Heading / UI Font | Monospace Font | Description |
|---|---|---|---|
| `inter` | Inter, system-ui | Fira Code, monospace | Default SWAL typography |
| `jetbrains` | JetBrains Mono, monospace | JetBrains Mono, monospace | Technical all-monospace aesthetic |
| `system` | system-ui, -apple-system | ui-monospace, SFMono | Native OS fonts (zero external font downloads) |
| `fira` | Fira Sans, sans-serif | Fira Code, monospace | Technical editorial typography |

Activate via HTML attribute:

```html
<html data-font="jetbrains">
```

Or via direct CSS import:

```css
@import '@swal/ui/fonts.css';
```

---

## Offline-First: Storage & Backup

APIs and components for resilient offline web applications.

```svelte
<script>
  import { StorageStatus, BackupPanel, Toaster } from '@swal/ui';
  import { requestPersistence, getStorageStatus, isQuotaError } from '@swal/ui/storage';
  import { createBackup, restoreBackup } from '@swal/ui/backup';

  const collect = async () => ({
    notes: [/* IndexedDB records */]
  });

  const apply = async (store, records, mode) => {
    // restore records into local database
  };
</script>

<Toaster />
<StorageStatus />
<BackupPanel
  appId="my-app"
  schemaVersion={1}
  {collect}
  {apply}
  onRestored={() => location.reload()}
/>
```

Exported Storage Utilities:
- `requestPersistence()`: Requests durable browser storage quota.
- `getStorageStatus()`: Returns `{ quota, usage, percentage, persisted }`.
- `isQuotaError(error)`: Detects browser quota exhaustion errors.
- `formatBytes(bytes)`: Formats byte numbers into human-readable strings.

Exported Backup Utilities:
- `createBackup({ appId, version, data })`: Generates a structured JSON backup payload.
- `downloadBackup(payload, filename)`: Triggers browser file download.
- `readBackupFile(file)`: Parses and validates uploaded backup files.
- `validateBackup(payload, schema)`: Verifies backup integrity.

---

## User Preferences (`@swal/ui/prefs`)

Modular user preferences engine with customizable panels and zero-flash head bootstrapping.

```ts
import { createPrefsStore, prefsBootstrapScript, isPanelEnabled, panelOption } from '@swal/ui/prefs';

const schema = {
  version: 1,
  modules: [
    { id: 'dashboard', label: 'Dashboard', group: 'General', default: true, required: true },
    { id: 'telemetry', label: 'Telemetry', group: 'Advanced', default: false }
  ],
  panels: [
    {
      id: 'notifications',
      label: 'Notifications',
      scope: 'Global',
      default: true,
      options: [{ id: 'frequency', label: 'Frequency', type: 'number', default: 5, min: 1, max: 60 }]
    }
  ],
  presets: [
    { id: 'minimal', label: 'Minimal Mode', modules: { telemetry: false } }
  ]
};

const store = createPrefsStore({ schema, endpoint: '/api/prefs', storageKey: 'app:prefs' });
```

Components:
- `<OnboardingWizard {schema} value={prefs} onfinish={(p) => store.save(p)} />`
- `<PrefsEditor {schema} value={prefs} onchange={(p) => (prefs = p)} />`
- `<ThemeModeSwitch />`

---

## Vendored Drift Detection

Consuming apps that vendor component copies can detect drift using the included CLI binary:

```bash
npx swal-check-vendored-drift path/to/local/copy
```

---

## Flutter Companion Package (`flutter/`)

The design system is available for Flutter as the Dart package `swal_ui`. See [`flutter/README.md`](./flutter/README.md) for widgets, `ThemeData`, and installation instructions.

---

## Package Exports Summary

| Export Path | Contents |
|---|---|
| `@swal/ui` | All 27 Svelte 5 components and core library helpers |
| `@swal/ui/components/*.svelte` | Individual component entry points |
| `@swal/ui/tokens` / `@swal/ui/tokens.css` | Bone theme custom properties (`theme.css`) |
| `@swal/ui/colors` | Raw color palette variables (`colors.css`) |
| `@swal/ui/fonts.css` / `@swal/ui/tokens/fonts.css` | Typography presets (`data-font`) |
| `@swal/ui/themes.css` | Master stylesheet importing all token layers |
| `@swal/ui/ui.css` | Compiled component styling rules |
| `@swal/ui/bone-taller.css` | Bone Taller accent layer (`data-accent="taller"`) |
| `@swal/ui/taller.css` | Taller blueprint dual theme |
| `@swal/ui/antigravity.css` | Antigravity dual theme |
| `@swal/ui/tikpro.css` | TikPro high-contrast sci-fi telemetry theme |
| `@swal/ui/theme-mode` | Theme mode helpers: `getThemeMode()`, `setThemeMode()`, `themeModeScript()` |
| `@swal/ui/theme-boot` | Zero-flash bootstrapping scripts (`themeBootScript`) |
| `@swal/ui/prefs` | Schema-driven preference store and helpers |
| `@swal/ui/motion` | Transitions: `swalFade`, `swalSlide` |
| `@swal/ui/toast` | Reactive toast notification store (`toast`) |
| `@swal/ui/storage` | Storage persistence and quota monitor helpers |
| `@swal/ui/backup` | Offline backup export and restoration utilities |
| `@swal/ui/icons` | Icon registry: `ICONS`, `registerIcons`, `getIcon` |
| `@swal/ui/nav` | Navigation helpers: `isNavActive`, `findCurrentNav` |

---

## License

Licensed under the **Apache License 2.0** — see [LICENSE](./LICENSE).

---

*SouthWest AI Labs (SWAL) · Bone Theme & Svelte 5 UI Component Library*
