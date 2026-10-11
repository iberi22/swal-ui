# AGENTS.md — @swal/ui

Guidelines and architectural rules for autonomous agents and contributors working on `@swal/ui`.

---

## 1. SWAL Ecosystem Context

- **Canonical Goal:** Monorepo specifications in `docs/SWAL/GOAL.md`, `docs/SWAL/PROJECT_MAP.md`, and `docs/SWAL/README.md`.
- **Local Copy:** `.gitcore/docs/SWAL_GOAL.md`.
- **Pro Membership:** Gated by active SWAL node participation — no Stripe or fiat paywalls.
- **Memory Layer:** Xavier HTTP/MCP integration under namespaces `app/{appId}/instance/{instanceId}`.
- **Mesh Data Plane:** `edge-mesh` P2P CRDT WebRTC synchronization under `swal/{appId}/{instanceId}`.
- **Token Economics:** $SWAL ownership and staking yields govern ecosystem participation.
- **Backoffice:** `maloca/apps/swal-backoffice` consumes `@swal/ui`.
- **Protocol:** GitCore 3.8+ feature verification and tracking under `.gitcore/`.

---

## 2. Canonical Ecosystem Stack

| Layer | Stack | Details |
|-------|-------|---------|
| **Frontend** | **Svelte 5 + Astro** | Jamstack architecture for all SWAL client applications. |
| **Design System** | **`@swal/ui` (this repo)** | Svelte 5 runes, zero runtime dependencies, scoped CSS. |
| **Backend** | **`edge-hive`** | Rust node on VPS serving PWAs, SurrealDB, WASM edge functions, MCP. |
| **Memory** | **Xavier** | HTTP / MCP / XTSP memory engine. |
| **Data Plane** | **`edge-mesh`** | Peer-to-peer WebRTC CRDT sync. |
| **Governance** | **Maloca** | Council, support, proposals, and HumanChallenge. |

---

## 3. What is `@swal/ui`

`@swal/ui` is the unified design system and UI component library for the SouthWest AI Labs (SWAL) ecosystem. It provides:
- **Bone Theme**: A warm-minimalist palette (Alabaster Paper / Mineral Charcoal) with tactile glass and strict WCAG 2.2 AA contrast compliance.
- **Theme Variants**: Bone Taller (Bone + Taller signal orange accent), Taller blueprint, Antigravity, and TikPro sci-fi telemetry.
- **27 Svelte 5 Components**: Zero-dependency UI primitives, layout wrappers, telemetry widgets, offline persistence panels, and app shells.
- **Astro Island Readiness**: Full SSR safety with zero DOM-coupling during pre-rendering.

---

## 4. Development Rules & Engineering Standards

1. **Semantic Tokens First:** Never hardcode color hex values or raw pixel sizes in components. All tokens originate from `src/tokens/theme.css` and are accessed via CSS custom properties (`var(--swal-*)`).
2. **Component Conventions:** Place single Svelte components in `src/components/<ComponentName>.svelte`. Export public components in `src/components/index.js`.
3. **Svelte 5 Runes Only:** Use Svelte 5 reactivity runes (`$state`, `$props`, `$derived`, `$bindable`, `$effect`). Do not use deprecated Svelte 4 store APIs (`writable`, `readable`) inside components.
4. **Zero Runtime Dependencies:** The package must maintain zero external runtime dependencies (`dependencies: {}`). Utility logic lives in `src/lib/`.
5. **Component Styling Architecture:** Scoped component styles in `<style>` blocks. Both `themes.css` (tokens) and `ui.css` (compiled component styles) must be imported in consuming apps.
6. **SSR & Astro Island Safety:** Never access `window`, `document`, or browser storage directly at the top level of Svelte component scripts. Guard DOM interactions inside `$effect` or lifecycle callbacks.
7. **Documentation Discipline:** Any new or modified component must be reflected in `README.md`, `USAGE.md`, and covered with unit/SSR tests.
8. **Verification:** Validate changes using `pnpm run lint`, `pnpm run typecheck`, `pnpm test`, and `pnpm run build`.

---

## 5. Definition of Done (DoD)

- [ ] `pnpm run build` succeeds with zero errors and warnings.
- [ ] `pnpm test` passes (all unit, SSR, and DOM tests green).
- [ ] `pnpm run typecheck` passes with exit code 0.
- [ ] `pnpm run check` (theme WCAG AA audit) passes.
- [ ] Documentation updated in `README.md` and `USAGE.md`.
- [ ] Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`).
