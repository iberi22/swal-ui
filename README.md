# @swal/ui — SWAL Design System

> Identidad visual unificada para todas las apps del ecosistema SouthWest AI Labs.
> Tema **"Hive Dark"** — portado fielmente de `edge-hive/edge-hive-admin`.
> **Svelte 5 (runes) · Zero-dependency · CSS scoped · Astro-compatible**
>
> 📖 Guía de uso completa con ejemplos: [`USAGE.md`](./USAGE.md)
> 🎨 Demo interactiva: `npm run dev` → demo/

## Design Tokens

Variables CSS en `:root` — framework-agnostic (funcionan en Svelte, Astro, HTML puro):

| Token | Valor | Uso |
|-------|-------|-----|
| `--swal-bg` | `#020617` (slate-950) | Fondo principal / terminal |
| `--swal-elevated` | `#0f172a` (slate-900) | Sidebar / paneles |
| `--swal-elevated-850` | `#151e2e` (slate-850) | Cards elevadas |
| `--swal-void` | `#000000` | Terminal black |
| `--swal-accent` | `#06b6d4` (cyan) | Datos / info — **acción primaria** |
| `--swal-accent-orange` | `#f97316` | System / nav / warning |
| `--swal-text` | `#f1f5f9` (slate-100) | Texto principal |
| `--swal-text-secondary` | `#94a3b8` (slate-400) | Texto secundario |
| `--swal-success` | `#10b981` | OK |
| `--swal-warning` | `#f59e0b` | Advertencia |
| `--swal-danger` | `#ef4444` | Error |

## Instalación

```bash
# Workspace npm/pnpm (maloca, edge-hive, apps)
npm install @swal/ui
```

Importar tokens **una sola vez** en el entry point (`main.ts`, `layout.astro`, `+layout.svelte`):

```css
@import '@swal/ui/tokens'; /* theme.css (incluye colors.css) */
```

## Uso (Svelte 5)

```svelte
<script>
  import { Button, Card, StatusBadge } from '@swal/ui';
</script>

<Card>
  <h3>Nodo</h3>
  <StatusBadge status="healthy" label="online" />
  <Button variant="primary" glow>Conectar</Button>
</Card>
```

## Uso (Astro)

```astro
---
import { Button } from '@swal/ui';
---
<!-- Island: solo client-side -->
<Button client:load variant="primary" glow>Conectar</Button>
```

## Componentes (15)

| Componente | Descripción |
|-----------|-------------|
| `Button` | Variantes: primary (cyan), orange, outline, ghost, danger |
| `Card` | Superficie estándar con borde translúcido |
| `Badge` | Etiqueta de estado |
| `Input` | Campo de texto con tema SWAL |
| `StatusBadge` | healthy/warning/error/offline con pulso neon |
| `Modal` | Diálogo modal |
| `Tabs` | Pestañas |
| `Table` | Tabla de datos |
| `Skeleton` | Loading placeholder |
| `Toaster` | Notificaciones toast (store) |
| `Terminal` | Terminal interactivo (responsive) |
| `LogViewer` | Visor de logs |
| `CommandPalette` | Palette Ctrl+K |
| `ConfigEditor` | Editor de config con sync JSON |
| `LoadingState` | Estado de carga |

## Estructura

```
swal-ui/
├── package.json          # @swal/ui v0.2.0 — exports svelte + tokens
├── vite.config.js        # build Svelte (vite-plugin-svelte)
├── demo/                 # Showcase interactivo
├── USAGE.md              # Guía de uso con ejemplos reales
└── src/
    ├── components/       # 15 componentes Svelte 5
    ├── tokens/           # theme.css (tokens CSS) + colors.css
    ├── styles/           # global.css (base, scrollbar, CRT)
    └── lib/              # motion.js, toast.svelte.js
```

## Roadmap

- [ ] DashboardLayout (sidebar + GlobalTicker) para apps SWAL
- [ ] Landing page template (Astro)
- [ ] Verificar islands en Astro (`UI-ASTRO-01`)
- [ ] Modo claro (fase 2)
- [ ] Publicar a npm registry

---
*SouthWest AI Labs · Stack: Svelte 5 + Astro (Jamstack) · Backend: edge-hive*
