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

## Qué es @swal/ui

Design system compartido del ecosistema. **Todas las apps SWAL usan este paquete** para que el UI sea idéntico entre productos. Extraído de `edge-hive/edge-hive-admin` (paleta "Hive Dark").

## Reglas

1. **No inventar colores.** Todos los colores vienen de `src/tokens/index.ts`. Si falta un token, agregarlo AHÍ (no hardcodear en componentes).
2. **Componentes en `src/components/ui/`.** Un componente por archivo, export desde `src/index.ts`.
3. **Tipado estricto.** `npx tsc --noEmit` debe pasar 0 errores.
4. **Build de librería.** `npm run build` → dist/ ESM + dts. Verificar que compile antes de commit.
5. **Documentación.** Todo componente nuevo → tabla en README.md.
6. **Sin deps pesadas.** React + lucide + clsx/tailwind-merge solamente. No meter chart libs en el core (van en wrappers).

## Stack

- React 19 + TypeScript (igual que edge-hive-admin)
- Vite 6 (modo librería) + vite-plugin-dts
- Tailwind CSS 3.4 (preset exportado)
- lucide-react (iconos)

## DoD

- [ ] `npm run build` sin errores ni warnings
- [ ] `npx tsc --noEmit` limpio
- [ ] Tokens documentados en README
- [ ] Commits: `feat:`, `fix:`, `docs:`, `chore:`
