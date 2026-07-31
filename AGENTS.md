# AGENTS.md — @swal/ui

## SWAL ecosystem goal (do not disconnect)

- **Canonical:** monorepo `docs/SWAL/GOAL.md` · `docs/SWAL/PROJECT_MAP.md` · `docs/SWAL/README.md`
- **Local copy:** `.gitcore/docs/SWAL_GOAL.md` (via `gitcore-update`)
- **Pro:** active SWAL node only — **no Stripe** as Pro unlock
- **Memory:** Xavier HTTP/MCP · namespaces `app/{appId}/instance/{instanceId}`
- **Mesh:** edge-mesh · `swal/{appId}/{instanceId}` (when P2P applies)
- **Token:** $SWAL ownership + stake yield (not parallel OMNI/XAV coins)
- **Backoffice:** `maloca/apps/swal-backoffice` — consume @swal/ui
- **Protocol:** GitCore 3.8 · feature-verify / implementation-score under `.gitcore/scripts/`

## Stack del Ecosistema (canónico)

| Capa | Stack | Detalle |
|------|-------|---------|
| **Frontend** | **Svelte 5 + Astro** | Jamstack para TODAS las apps SWAL |
| **Design system** | **@swal/ui (este repo)** | Svelte 5 runes, zero-dependency, CSS scoped |
| **Backend de apps** | **edge-hive** | Nodo Rust en VPS — sirve PWAs, SurrealDB, edge functions WASM, MCP |
| **Memoria** | **Xavier** | HTTP/MCP/XTSP |
| **Data plane** | **edge-mesh** | P2P CRDT WebRTC |
| **Gobernanza** | **Maloca** | Consejo, soporte, discusiones, HumanChallenge |

## Qué es @swal/ui

Design system compartido del ecosistema. **Todas las apps SWAL usan este paquete** para que el UI sea idéntico entre productos. Portado fielmente de `edge-hive-admin` (paleta "Hive Dark"): dark slate + acentos cyan/orange, estética industrial.

## Reglas

1. **No inventar colores.** Todos los colores vienen de `src/tokens/theme.css` (CSS custom properties `--swal-*`). Si falta un token, agregarlo AHÍ (no hardcodear en componentes).
2. **Componentes en `src/components/`.** Un componente por archivo `.svelte`, export desde `src/components/index.js`.
3. **Svelte 5 (runes).** Usar `$state`, `$props`, `$derived` — NO la API legacy de Svelte 4.
4. **Zero-dependency.** No agregar dependencias runtime. CSS scoped por componente.
5. **Build.** `npm run build` → `dist/ui.css` + `dist/ui.js`. Verificar que compile antes de commit.
6. **Documentación.** Todo componente nuevo → `USAGE.md` (ejemplos reales) + `README.md`.
7. **Astro-compatible.** Los componentes deben funcionar como islands en `.astro` (sin acceso a window en server-side).

## Estructura

```
swal-ui/
├── package.json          # @swal/ui v0.2.0 — exports svelte + tokens
├── vite.config.js        # build Svelte (vite-plugin-svelte)
├── demo/                 # Showcase interactivo (dev)
├── USAGE.md              # Guía de uso con ejemplos
└── src/
    ├── components/       # 15 componentes Svelte 5
    ├── tokens/           # theme.css (tokens CSS) + colors.css
    ├── styles/           # global.css (base, scrollbar, CRT)
    └── lib/              # motion.js, toast.svelte.js
```

## DoD

- [ ] `npm run build` sin errores ni warnings
- [ ] Componentes usan Svelte 5 runes
- [ ] Tokens documentados en USAGE.md
- [ ] Zero-dependency runtime
- [ ] Commits: `feat:`, `fix:`, `docs:`, `chore:`
