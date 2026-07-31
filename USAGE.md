# @swal/ui — Guía de uso

> Design system unificado del ecosistema SWAL.
> Tema: **Edge-Hive** — portado fielmente desde `edge-hive-admin`.
> **Svelte 5 (runes) · Cero dependencias · CSS scoped** — no requiere Tailwind.

---

## Instalación

```bash
# Workspace npm/pnpm
npm install @swal/ui
```

```json
{ "dependencies": { "@swal/ui": "workspace:*" } }
```

Importar tokens **una sola vez** en el entry point (`main.ts`, `layout.astro`, `+layout.svelte`):

```css
@import '@swal/ui/tokens'; /* theme.css (incluye colors.css) */
```

---

## Design Tokens

Variables CSS en `:root`:

| Token | Default | Descripción |
|-------|---------|-------------|
| `--swal-bg` | `#020617` | Fondo principal (slate-950) |
| `--swal-surface` | `rgba(15,23,42,0.8)` | Superficie de tarjetas |
| `--swal-surface-hover` | `rgba(30,41,59,0.6)` | Hover de superficies |
| `--swal-surface-active` | `rgba(51,65,85,0.4)` | Estado activo / skeletons |
| `--swal-elevated` | `#0f172a` | Elementos elevados (modals) |
| `--swal-elevated-850` | `#151e2e` | slate-850 del origen |
| `--swal-overlay` | `rgba(2,6,23,0.8)` | Overlay de modales |
| `--swal-void` | `#000` | Negro terminal (hive-void) |
| `--swal-border` | `rgba(255,255,255,0.08)` | Borde estándar |
| `--swal-border-light` | `rgba(255,255,255,0.12)` | Borde marcado |
| `--swal-accent` | `#06b6d4` | Acento cyan (hive-cyan, datos) |
| `--swal-accent-hover` | `#22d3ee` | Hover del acento |
| `--swal-accent-muted` | `rgba(6,182,212,0.12)` | Fondo sutil cyan |
| `--swal-accent-orange` | `#f97316` | Acento orange (hive-orange, sistema/nav) |
| `--swal-accent-orange-muted` | `rgba(249,115,22,0.12)` | Fondo sutil orange |
| `--swal-success` / `--swal-warning` / `--swal-danger` / `--swal-info` | `#10b981` / `#f59e0b` / `#ef4444` / `#06b6d4` | Semánticos |
| `--swal-text` | `#f1f5f9` | Texto primario |
| `--swal-text-secondary` | `#94a3b8` | Texto secundario |
| `--swal-text-muted` | `#64748b` | Texto muted |
| `--swal-font` | `Inter, system-ui, sans-serif` | Fuente UI |
| `--swal-font-mono` | `Fira Code, JetBrains Mono, monospace` | Fuente datos/terminal |
| `--swal-shadow-neon-cyan` | `0 0 15px …, 0 0 30px …` | Neon cyan (valores del origen) |
| `--swal-shadow-neon-orange` | igual en orange | Neon orange |
| `--swal-radius` / `-sm` / `-lg` | `8px` / `4px` / `12px` | Radios |
| `--swal-transition-fast` / `-slow` | `150ms` / `300ms` | Transiciones |
| `--swal-ease-out` | `cubic-bezier(0.16,1,0.3,1)` | Ease del `.animate-in` original |

### Clases utilitarias

| Clase | Descripción |
|-------|-------------|
| `.swal-grid-bg` | Grid background estilo edge-hive |
| `.swal-glass` | Glass morphism (⚠️ costoso en móvil: solo superficies pequeñas) |
| `.swal-scrollbar` | Scrollbar industrial 4px (webkit + Firefox) |
| `.swal-neon-cyan` / `.swal-neon-orange` | Text-shadow neon |
| `.swal-scanline` | Efecto scanline |
| `.swal-safe-area` | Padding `env(safe-area-inset-*)` para PWA móvil |
| `.swal-dvh` | `min-height: 100dvh` (fix viewport móvil) |
| `.swal-touch` | `touch-action: manipulation` + sin tap-highlight |
| `.swal-enter` / `.swal-enter-scale` | Entrada fade / scale |
| `.swal-animate-in` | Duración+easing base (combinar con keyframes) |
| `.swal-marquee` / `.swal-flicker` / `.swal-glitch` | Keyframes del origen (ticker, CRT) |
| `.swal-ping` / `.swal-pulse` / `.swal-spin` | Animaciones de estado |
| `.swal-bg` `.swal-surface` `.swal-elevated` `.swal-text` `.swal-accent` `.swal-success` … | Colores (ver `colors.css`) |

Todas las animaciones respetan `prefers-reduced-motion`.

---

## Componentes

```svelte
import { Button, Card, Badge, Modal, Table, Tabs, Input, Skeleton,
         StatusBadge, LoadingState, Terminal, CommandPalette, Toaster } from '@swal/ui';
```

API **Svelte 5**: eventos como props (`onclick`, `onclose`), contenido como snippet (`children`), y `bind:` en props `$bindable`.

### `<Button>`

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'primary'\|'orange'\|'secondary'\|'ghost'\|'danger'` | `'primary'` | Estilo |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` | Tamaño |
| `disabled` / `loading` / `fullWidth` | `boolean` | `false` | Estados |
| `onclick` | `function` | — | Click handler |

```svelte
<Button variant="primary" onclick={save}>Guardar</Button>
<Button variant="orange" loading={deploying}>Deploy</Button>
<Button variant="danger" size="sm">Eliminar</Button>
```

### `<Card>`

| Prop | Tipo | Default |
|------|------|---------|
| `variant` | `'default'\|'surface'\|'elevated'\|'glass'` | `'default'` |
| `padding` | `'none'\|'sm'\|'md'\|'lg'` | `'md'` |
| `hoverable` | `boolean` | `false` |
| `onclick` | `function` | — (si se pasa, renderiza `<button>` accesible) |

### `<Badge>`

| Prop | Tipo | Default |
|------|------|---------|
| `variant` | `'success'\|'warning'\|'danger'\|'info'\|'orange'\|'neutral'` | `'neutral'` |
| `size` | `'sm'\|'md'` | `'sm'` |
| `pulse` | `boolean` | `false` |
| `dot` | `boolean` | `true` salvo neutral |

### `<StatusBadge>` *(portado de edge-hive-admin)*

Dot de estado con anillo ping expansivo.

| Prop | Tipo | Default |
|------|------|---------|
| `status` | `'healthy'\|'warning'\|'error'\|'offline'` | `'offline'` |
| `pulse` | `boolean` | `true` (anillo ping; no aplica a `offline`) |

```svelte
<StatusBadge status="healthy" />
```

### `<Modal>` *(portado fiel: scroll-lock, blur, gradientes)*

| Prop | Tipo | Default |
|------|------|---------|
| `open` | `boolean` (`bind:open`) | `false` |
| `title` | `string` | `''` |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` |
| `icon` | `snippet` | — |
| `onclose` | `function` | — |

Cierra con Escape, backdrop o botón X. Bloquea el scroll del body mientras está abierto. Body scrolleable (`max-height: 80vh`) con `.swal-scrollbar`.

```svelte
<Modal bind:open={show} title="Confirmar" size="sm">
  <p>¿Seguro?</p>
  <Button variant="danger" onclick={confirm}>Confirmar</Button>
</Modal>
```

### Toasts: `<Toaster>` + `toast` *(portado de ToastContext)*

```svelte
<script>
  import { Toaster } from '@swal/ui';
  import { toast } from '@swal/ui/toast';
</script>

<!-- Una sola vez, en el layout raíz -->
<Toaster />
```

```js
toast.success('Guardado', 'OK');            // auto-dismiss 5s
toast.error('Falló la conexión');
toast.warning('Uso de disco al 90%');
toast.info('Sincronizando…');
const id = toast.loading('Desplegando…');   // sin auto-dismiss
toast.dismiss(id);                          // cierre manual
```

Incluye iconos por tipo, scanline decorativa y barra de progreso de auto-dismiss (como el original).

### `<CommandPalette>` *(portado, generalizado)*

| Prop | Tipo | Default |
|------|------|---------|
| `open` | `boolean` (`bind:open`) | `false` |
| `items` | `[{ id, label, hint?, action() }]` | `[]` |
| `placeholder` | `string` | `'Type a command or search...'` |
| `footer` | `string` | `'SWAL Command'` |

Navegación con ↑↓ / Enter / Escape, filtro en vivo, foco automático. El atajo ⌘K lo implementa la app:

```svelte
<script>
  let paletteOpen = $state(false);
  const items = [
    { id: 'dash', label: 'Go to Dashboard', action: () => goto('/') },
    { id: 'deploy', label: 'Deploy', hint: '⌘D', action: deploy },
  ];
</script>

<svelte:window onkeydown={(e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); paletteOpen = !paletteOpen; }
}} />

<CommandPalette bind:open={paletteOpen} {items} />
```

### `<Terminal>` *(portado)*

| Prop | Tipo | Default |
|------|------|---------|
| `logs` | `[{ id, timestamp, level, service, message }]` | `[]` |
| `title` | `string` | `'STD_OUT >> SWAL_RUNTIME'` |
| `prompt` | `string` | `'root@swal:~$'` |
| `maxHeight` | `string \| null` | `null` |

### `<LogViewer>` *(portado de edge-hive-admin)*

| Prop | Tipo | Default |
|------|------|---------|
| `lines` | `string[] \| [{ level, timestamp, message }]` | `[]` |
| `filterLevel` | `'debug'\|'info'\|'warn'\|'error'` | `'debug'` |
| `autoScroll` | `boolean` | `true` |
| `maxHeight` | `string` (CSS) | `'300px'` |
| `title` | `string` | `'Real-Time Log Stream'` |

Acepta líneas crudas (`'[INFO] msg'` — detecta el nivel por contenido) o entradas
estructuradas (`{ level, timestamp, message }`). Filtra por nivel mínimo, colores
edge-hive (`error`→danger, `warn`→warning, `info`→success, `debug`→muted), fuente
mono y scrollbar industrial.

```svelte
<LogViewer lines={logs} filterLevel="warn" maxHeight="400px" />
```

### `<ConfigEditor>` *(portado de edge-hive-admin, generalizado)*

| Prop | Tipo | Default |
|------|------|---------|
| `config` | `Record<string, any>` | `{}` |
| `schema` | `[{ key, label, type, options? }]` | `[]` (infiere tipos) |
| `title` | `string` | `'Configuration'` |
| `onchange` | `(config) => void` | — (emite en cada edición) |
| `onsave` | `(config) => void` | — (botón Save; fallback: `onchange`) |

`type`: `'string' | 'number' | 'boolean' | 'select'` (con `options: string[] | {value,label}[]`).
Si `schema` está vacío, el tipo se infiere del valor actual de cada clave.
El borrador interno solo se re-sincroniza cuando el padre cambia `config` de verdad
(comparación JSON), sin pisar ediciones en curso.

```svelte
<ConfigEditor
  config={cfg}
  schema={[
    { key: 'port', label: 'Port', type: 'number' },
    { key: 'mode', label: 'Mode', type: 'select', options: ['live', 'paper'] },
  ]}
  onchange={(next) => (cfg = next)}
/>
```

Colores por nivel (`ERROR/WARN/DEBUG/INFO`), auto-scroll suave al fondo (`autoScroll=false` lo desactiva), cursor parpadeante.
Con `maxHeight` (p. ej. `'60vh'`) el body crece con el contenido hasta ese tope (anula `height`).

### `<LoadingState>` *(portado)*

| Prop | Tipo | Default |
|------|------|---------|
| `message` | `string` | `'Loading...'` |
| `height` | `string` | `'16rem'` |
| `error` | `string \| null` | `null` |
| `onretry` | `(() => void) \| null` | `null` |

Con `error` muestra icono ✗ + mensaje en rojo en vez del spinner; `onretry` añade un botón "↻ Retry".

### `<Table>`

`columns: [{ key, label, width?, align? }]`, `rows: [{ key: value }]`, `variant: 'default'|'compact'`.

Snippets opcionales para contenido custom:
- `{#snippet cell(row, col)}` — render por celda (badges, valores coloreados, etc.)
- `{#snippet header(col)}` — render por header (botones sortable, tooltips, etc.)

```svelte
<Table {columns} {rows}>
  {#snippet header(col)}
    <button onclick={() => sort(col.key)}>{col.label} ▲</button>
  {/snippet}
  {#snippet cell(row, col)}
    {#if col.key === 'status'}
      <Badge variant="success">{row.status}</Badge>
    {:else}
      {row[col.key]}
    {/if}
  {/snippet}
</Table>
```

### `<Tabs>`

`tabs: [{ id, label }]`, `bind:active`. Roles ARIA `tablist`/`tab` incluidos.

### `<Input>`

`bind:value`, `label`, `type`, `placeholder`, `error`. Label/error asociados con `for`/`aria-describedby`.

### `<Skeleton>`

`variant: 'text'|'card'|'circle'`, `width`, `height`.

---

## Motion (transiciones Svelte)

```svelte
<script>
  import { swalFade, swalSlide } from '@swal/ui/motion';
</script>

<div transition:swalFade={{ duration: 200 }}>…</div>
<div transition:swalSlide={{ direction: 'up', distance: 8 }}>…</div>
```

> En Astro, las transiciones solo corren en islas hidratadas (`client:*`).
> Para HTML estático usa las clases CSS `.swal-enter` / `.swal-enter-scale`.

---

## Uso con Astro (PWA móvil)

```astro
---
// layout.astro
import '@swal/ui/tokens';
---
<body class="swal-dvh swal-safe-area swal-touch">
  <slot />
</body>
```

- Hidrata solo lo interactivo: `<Button client:visible />`, `<Terminal client:idle />`.
- Card/Badge/Table sin interactividad: déjalos estáticos (HTML puro, cero JS).
- Evita `.swal-glass` en superficies grandes (costo de GPU en móvil).
- Aplica `.swal-safe-area` al contenedor raíz para notch/status bar.

## Theming

```css
:root {
  --swal-accent: #10b981;        /* emerald */
  --swal-accent-hover: #34d399;
  --swal-accent-muted: rgba(16,185,129,0.12);
}
```

## Package Exports

| Export | Contenido |
|--------|-----------|
| `@swal/ui` | Todos los componentes |
| `@swal/ui/components/*.svelte` | Componente individual |
| `@swal/ui/tokens` | theme.css + colors.css |
| `@swal/ui/motion` | swalFade, swalSlide |
| `@swal/ui/toast` | store `toast` + `toasts` |

## License

SWAL Ecosystem — AGPL-3.0.
