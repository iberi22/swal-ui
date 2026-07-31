# @swal/ui — SWAL Design System

> Identidad visual unificada para todas las apps del ecosistema SouthWest AI Labs.
> Paleta **"Hive Dark"** extraída de `edge-hive/edge-hive-admin` (Jul 2026).

## Design Tokens

### Colores

| Token | Hex | Uso |
|-------|-----|-----|
| `background.deepest` | `#020617` (slate-950) | Fondo principal / terminal |
| `background.dark` | `#0f172a` (slate-900) | Sidebar / paneles |
| `background.elevated` | `#151e2e` (slate-850) | Cards elevadas |
| `accent.orange` | `#f97316` | **Acción primaria** — Rust/System |
| `accent.cyan` | `#06b6d4` | **Datos/Info** — Stable |
| `text.primary` | `#e2e8f0` (slate-200) | Texto principal |
| `status.healthy` | `#10b981` | OK |
| `status.warning` | `#f97316` | Advertencia |
| `status.error` | `#ef4444` | Error |
| `status.offline` | `#475569` | Offline |

### Tipografía

- **UI:** Inter (300–700)
- **Data/Terminal:** Fira Code (300–600)

### Efectos de marca

- **Neon glow:** `shadow-neon-orange` / `shadow-neon-cyan`
- **CRT scanlines:** clase `.swal-crt` en `<body>`
- **Vignette:** incluido en `.swal-crt`
- **Animaciones:** marquee, flicker, glitch

## Uso

### 1. Instalar

```bash
cd swal-ui && npm install && npm run build
```

En una app consumidora:

```bash
npm install ../swal-ui  # o publicar a registry privado
```

### 2. Tailwind preset

```js
// tailwind.config.js
module.exports = {
  presets: [require('@swal/ui/tokens/tailwind')],
  content: ['./src/**/*.{ts,tsx}', '../swal-ui/src/**/*.{ts,tsx}'],
}
```

### 3. Importar componentes

```tsx
import { Button, Card, StatusBadge } from '@swal/ui';
import '@swal/ui/styles.css';

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nodo</CardTitle>
      </CardHeader>
      <CardContent>
        <StatusBadge status="healthy" label="online" />
        <Button glow>Conectar</Button>
      </CardContent>
    </Card>
  );
}
```

### 4. Efecto CRT (opcional)

```tsx
// index.html → <body class="dark swal-crt">
```

## Componentes

| Componente | Descripción |
|-----------|-------------|
| `Button` | Variantes: default (orange), outline, ghost, danger, cyan · glow opcional |
| `Card` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| `StatusBadge` | Estado healthy/warning/error/offline con pulso neon |

## Estructura

```
swal-ui/
├── package.json          # @swal/ui, build como librería ESM
├── vite.config.ts        # vite-plugin-dts para tipos
├── tsconfig.json
└── src/
    ├── index.ts          # Export público
    ├── tokens/
    │   ├── index.ts      # Design tokens (colores, tipografía, efectos)
    │   └── tailwind.ts   # Tailwind preset
    ├── styles/
    │   └── global.css    # Base + scanlines + scrollbar + swal-card
    ├── components/ui/    # Button, Card, StatusBadge
    └── utils/cn.ts       # clsx + tailwind-merge
```

## Roadmap

- [ ] `DashboardLayout` — sidebar navegación (port desde edge-hive-admin)
- [ ] `Modal` / `CommandPalette` (Ctrl+K)
- [ ] `MetricsChart` wrapper (recharts con paleta SWAL)
- [ ] `Terminal` / `LogViewer`
- [ ] Landing page template
- [ ] Modo claro (fase 2)
- [ ] Publicar a npm (registry privado o público)

---
*SouthWest AI Labs · El humano piensa, SWAL construye.*
