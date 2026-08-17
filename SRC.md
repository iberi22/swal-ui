# SRC.md — @swal/ui Source Tree & Directory Architecture

## Directory Structure

```
swal-ui/
├── .gitcore/              # GitCore protocol configuration & tracking
│   ├── docs/             # Local copies of SWAL specs (SWAL_GOAL.md)
│   └── features.json     # Feature tracking schema v2
├── demo/                  # Showcase and interactive demo environment
│   └── astro-islands/    # Astro island integration showcase
├── src/                   # Package source code
│   ├── components/       # Svelte 5 component implementations
│   ├── lib/              # Motion utilities & toast stores
│   ├── styles/           # Global styles and CRT effects
│   └── tokens/           # Theme tokens (theme.css, colors.css)
├── tests/                 # Unit & integration tests
├── USAGE.md               # Component usage manual & examples
├── README.md              # Project overview and design system summary
├── AGENTS.md              # Agent ecosystem guidance
└── package.json           # @swal/ui npm package configuration
```

## Description of Key Modules

- **`src/components/`**: 15+ UI components built with Svelte 5 runes (`$state`, `$props`, `$derived`).
- **`src/tokens/`**: CSS custom property definitions (`--swal-*`) for the Hive Dark color palette.
- **`src/lib/`**: Helpers for animations and client-side stores (e.g. `toast.svelte.js`).
- **`demo/`**: Development environment and showcase application for verifying Svelte and Astro island behavior.
