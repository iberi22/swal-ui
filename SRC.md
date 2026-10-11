# SRC.md — @swal/ui Source Tree & Directory Architecture

Architecture and file structure overview for the `@swal/ui` package.

---

## Directory Structure

```
swal-ui/
├── .github/              # GitHub Actions workflows & dependabot configuration
├── .gitcore/             # GitCore protocol tracking & specifications
│   ├── docs/             # Canonical SWAL ecosystem goals (SWAL_GOAL.md)
│   └── features.json     # Protocol v3.9.0 feature matrix
├── demo/                 # Interactive showcases and local dev testbeds
│   └── astro-islands/    # Astro island SSR & hydration integration harness
├── docs/                 # Project documentation & requirements
│   └── SRS/              # Software Requirements Specifications (REQUIREMENTS.md)
├── flutter/              # Flutter companion package (swal_ui Dart package)
│   ├── lib/              # Generated Material 3 tokens & Flutter widgets
│   └── example/          # Flutter showcase application
├── scripts/              # Build, audit, and token sync utilities
│   ├── check-vendored-drift.mjs  # CLI to detect divergence in vendored copies
│   ├── gen-flutter-tokens.mjs    # Synchronizes CSS tokens to Dart definitions
│   └── themes-audit.mjs          # WCAG AA contrast auditor & selector validator
├── src/                  # Library source code
│   ├── components/       # Svelte 5 rune-based UI components (27 components)
│   ├── layouts/          # Base HTML and application shell templates
│   ├── lib/              # Utilities, stores, navigation, and storage helpers
│   │   ├── prefs/        # Schema-driven user interface preference store & types
│   │   ├── backup.js     # IndexedDB backup export, restore, and validation
│   │   ├── icons.js      # Unified SVG icon registry and lookup
│   │   ├── motion.js     # Custom Svelte easing and transition helpers
│   │   ├── nav.js        # Active route resolution and navigation state
│   │   ├── storage.js    # Storage persistence API & quota error detection
│   │   ├── theme-boot.js # Zero-flash theme & layout bootstrapping scripts
│   │   ├── themeMode.js  # Light / dark / system theme switching logic
│   │   └── toast.svelte.js # Reactive runes-based toast notification store
│   ├── styles/           # Global stylesheets, scrollbars, CRT scanlines
│   ├── tokens/           # CSS design tokens (theme.css, colors.css, taller.css, etc.)
│   └── themes.css        # Master theme registry importing token layers
├── tests/                # Automated Vitest test suite (SSR, DOM, contract tests)
├── AGENTS.md             # Guidelines for autonomous coding agents
├── CHANGELOG.md          # Version changelog
├── CONTRIBUTING.md       # Contribution guide
├── LICENSE               # Apache License 2.0
├── NOTICE                # Attribution and notices
├── package.json          # Package manifest (@swal/ui@0.2.0)
├── README.md             # Primary repository documentation
├── SECURITY.md           # Security disclosure policy
├── SRC.md                # Source architecture guide (this file)
└── USAGE.md              # Detailed component usage guide and API examples
```

---

## Key Modules and Responsibilities

### 1. `src/components/`
Contains 27 production Svelte 5 components built with runes (`$state`, `$derived`, `$props`, `$bindable`, `$effect`). Components use scoped CSS and semantic custom properties.

Exported primitives and composite widgets:
- **Primitives:** `Button`, `Card`, `Badge`, `Input`, `Table`, `Tabs`, `Skeleton`, `Modal`
- **Developer & Monitoring:** `StatusBadge`, `LoadingState`, `Terminal`, `CommandPalette`, `Toaster`, `LogViewer`, `ConfigEditor`
- **Application Layouts:** `DashboardLayout`, `GlobalTicker`, `Landing`, `QRCode`, `Icon`, `MobileNav`, `AppShell`
- **Theme & Preferences:** `PrefsEditor`, `OnboardingWizard`, `ThemeModeSwitch`
- **Offline & Storage:** `StorageStatus`, `BackupPanel`
- **Specialized Dialogs:** `ConfigFloatingWindow` (available via direct import)

### 2. `src/tokens/` & `src/themes.css`
Framework-agnostic CSS design tokens:
- `theme.css`: Core Bone theme (Papel Alabastro / Carbón Mineral) and semantic contract (`--swal-bg`, `--swal-surface`, `--swal-text`, `--swal-border`, `--swal-accent`).
- `colors.css`: Base color definitions and hex mappings.
- `bone-taller.css`: Bone theme with Taller signal orange (`#FF6A13`) accent.
- `taller.css`: Blueprint technical drawing theme (light flat / dark garage).
- `antigravity.css`: Antigravity dual theme.
- `tikpro.css`: High-contrast sci-fi telemetry theme.
- `fonts.css`: Typography presets (`inter`, `jetbrains`, `system`, `fira`).
- `tailwind.ts`: Tailwind configuration map for consuming apps.

### 3. `src/lib/`
Zero-dependency runtime helpers:
- `backup.js`: Portable JSON backup serialization, decompression, and restoration.
- `storage.js`: Storage manager wrapping `navigator.storage.persist()` and quota tracking.
- `themeMode.js`: Reactive theme mode resolution (`light`, `dark`, `system`) and anti-flicker head script.
- `theme-boot.js`: Anti-flash inline script generator for Astro and SSR setups.
- `prefs/`: Schema-driven user preference engine with module toggles and customizable panels.
- `toast.svelte.js`: Svelte 5 reactive notification store and dispatcher.
- `motion.js`: Standard transition functions (`swalFade`, `swalSlide`).
- `icons.js` & `nav.js`: SVG icon registry and route active-state evaluators.

### 4. `flutter/`
Complementary Flutter package (`swal_ui`) providing Material 3 `ThemeData` and custom widgets synchronized with web design tokens via `scripts/gen-flutter-tokens.mjs`.

### 5. `scripts/`
Maintenance scripts for auditing theme accessibility (`themes-audit.mjs`), validating vendored code synchronization (`check-vendored-drift.mjs`), and generating Flutter tokens (`gen-flutter-tokens.mjs`).
