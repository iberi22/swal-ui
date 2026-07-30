# @swal/ui — SWAL Design System Usage Guide

> Design system unificado para todas las aplicaciones del ecosistema SWAL.
> Tema: **Edge-Hive** — dark slate con acentos cyan/orange.

---

## Installation

```bash
# En un workspace npm/pnpm
npm install @swal/ui

# Importar tokens de diseño (una vez en entry point)
import '@swal/ui/tokens';
```

O desde un `package.json` local:

```json
{
  "dependencies": {
    "@swal/ui": "workspace:*"
  }
}
```

---

## Design Tokens

Importar en el entry point de la app:

```css
@import '@swal/ui/tokens';
```

Esto expone variables CSS en `:root`:

| Token | Default | Description |
|-------|---------|-------------|
| `--swal-bg` | `#020617` | Fondo principal (slate-950) |
| `--swal-surface` | `rgba(15, 23, 42, 0.8)` | Superficie de tarjetas |
| `--swal-surface-hover` | `rgba(30, 41, 59, 0.6)` | Hover de superficies |
| `--swal-elevated` | `#0f172a` | Elementos elevados (modals, dropdowns) |
| `--swal-overlay` | `rgba(2, 6, 23, 0.8)` | Overlay de modales |
| `--swal-border` | `rgba(255,255,255,0.08)` | Borde estándar |
| `--swal-accent` | `#06b6d4` | Color de acento (cyan) |
| `--swal-accent-hover` | `#22d3ee` | Hover del acento |
| `--swal-success` | `#10b981` | Verde éxito |
| `--swal-warning` | `#f59e0b` | Ámbar advertencia |
| `--swal-danger` | `#ef4444` | Rojo error |
| `--swal-text` | `#f1f5f9` | Texto primario |
| `--swal-text-secondary` | `#94a3b8` | Texto secundario |
| `--swal-text-muted` | `#64748b` | Texto muted |
| `--swal-font` | `Inter, system-ui, sans-serif` | Font familia principal |
| `--swal-font-mono` | `JetBrains Mono, Fira Code, monospace` | Font monospace |
| `--swal-shadow` | `0 4px 12px rgba(0,0,0,0.4)` | Sombra estándar |
| `--swal-shadow-lg` | `0 8px 32px rgba(0,0,0,0.6)` | Sombra grande |
| `--swal-shadow-glow-cyan` | `0 0 20px rgba(6,182,212,0.15)` | Glow cyan |

### Utility Classes

```css
@import '@swal/ui/tokens'; /* incluye theme.css con utilidades */

.swal-grid-bg     /* Grid background estilo edge-hive */
.swal-glass        /* Glass morphism sutil */
.swal-enter        /* Animación fade-in */
.swal-enter-scale  /* Animación scale-in */
```

También clases de color en `@swal/ui/tokens` (vía `colors.css`):

| Class | CSS prop |
|-------|----------|
| `.swal-bg` | `background: var(--swal-bg)` |
| `.swal-surface` | `background: var(--swal-surface)` |
| `.swal-elevated` | `background: var(--swal-elevated)` |
| `.swal-text` | `color: var(--swal-text)` |
| `.swal-text-secondary` | `color: var(--swal-text-secondary)` |
| `.swal-text-muted` | `color: var(--swal-text-muted)` |
| `.swal-border` | `border-color: var(--swal-border)` |
| `.swal-accent` | `color: var(--swal-accent)` |
| `.swal-accent-bg` | `background: var(--swal-accent)` |
| `.swal-success` | `color: var(--swal-success)` |
| `.swal-warning` | `color: var(--swal-warning)` |
| `.swal-danger` | `color: var(--swal-danger)` |
| `.swal-info` | `color: var(--swal-info)` |

---

## Components

Import named:

```svelte
import { Button, Card, Badge, Modal, Table, Tabs, Input, Skeleton } from '@swal/ui';
```

O import directo:

```svelte
import Button from '@swal/ui/components/Button.svelte';
```

---

### `<Button>`

Botones con variantes de color y tamaño.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `loading` | `boolean` | `false` | Estado de carga (spinner) |
| `fullWidth` | `boolean` | `false` | Ancho completo |

**Uso:**

```svelte
<Button variant="primary" size="md" on:click={handleClick}>
  Click me
</Button>

<Button variant="secondary" loading={true}>
  Processing...
</Button>

<Button variant="danger" size="sm">
  Delete
</Button>
```

---

### `<Card>`

Contenedor tipo tarjeta con múltiples variantes visuales.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'surface' \| 'elevated' \| 'glass'` | `'default'` | Estilo visual |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Padding interno |
| `hoverable` | `boolean` | `false` | Efecto hover + cursor pointer |

**Uso:**

```svelte
<Card variant="elevated">
  <h2>Contenido</h2>
  <p>Este es un card elevado con sombra.</p>
</Card>

<Card variant="glass" hoverable={true} on:click={handleSelect}>
  <span>Clickable card</span>
</Card>
```

---

### `<Badge>`

Etiqueta pequeña para estados, categorías o notificaciones.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'neutral'` | Color semántico |
| `size` | `'sm' \| 'md'` | `'sm'` | Tamaño |
| `pulse` | `boolean` | `false` | Animación pulse (para live indicators) |

**Uso:**

```svelte
<Badge variant="success">Active</Badge>
<Badge variant="danger" pulse={true}>Live</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="neutral" size="md">Default</Badge>
```

---

### `<Modal>`

Modal dialog con backdrop, título configurable, y cierre por Escape/click fuera.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controla visibilidad |
| `title` | `string` | `''` | Título del modal |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ancho máximo |

**Events:**

| Event | Detail | Description |
|-------|--------|-------------|
| `close` | — | Se dispara al cerrar (Escape, backdrop click, botón X) |

**Uso:**

```svelte
<script>
  import { Modal } from '@swal/ui';
  let showModal = false;
</script>

<Button on:click={() => showModal = true}>Open Modal</Button>

<Modal bind:open={showModal} title="Confirm Action" size="sm" on:close={() => showModal = false}>
  <p>Are you sure?</p>
  <div class="flex gap-2 mt-4">
    <Button variant="secondary" on:click={() => showModal = false}>Cancel</Button>
    <Button variant="danger" on:click={confirmAction}>Confirm</Button>
  </div>
</Modal>
```

---

### `<Table>`

Tabla responsive con columnas configurables.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `[{key, label, width?}]` | `[]` | Definición de columnas |
| `rows` | `[{key: value}]` | `[]` | Datos de filas |
| `variant` | `'default' \| 'compact'` | `'default'` | Densidad visual |

**Uso:**

```svelte
<script>
  const columns = [
    { key: 'name', label: 'Strategy' },
    { key: 'pnl', label: 'PnL' },
    { key: 'trades', label: 'Trades' },
  ];
  const rows = [
    { name: 'ScalperV2', pnl: '+$1,250', trades: 142 },
    { name: 'GridBotX', pnl: '-$320', trades: 89 },
  ];
</script>

<Table {columns} {rows} />
```

---

### `<Tabs>`

Navegación por tabs con indicador animado.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `[{id, label}]` | `[]` | Array de tabs |
| `active` | `string` | `''` | Tab activa (bind:active) |

**Uso:**

```svelte
<script>
  import { Tabs } from '@swal/ui';
  const tabItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'trades', label: 'Trades' },
    { id: 'risk', label: 'Risk' },
  ];
  let activeTab = 'overview';
</script>

<Tabs tabs={tabItems} bind:active={activeTab} />

{#if activeTab === 'overview'}
  <div class="p-4">Overview content</div>
{:else if activeTab === 'trades'}
  <div class="p-4">Trades content</div>
{:else if activeTab === 'risk'}
  <div class="p-4">Risk content</div>
{/if}
```

---

### `<Input>`

Input de texto con label, placeholder y estado de error.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Valor (bind:value) |
| `placeholder` | `string` | `''` | Placeholder |
| `type` | `string` | `'text'` | Tipo de input |
| `label` | `string` | `''` | Label sobre el input |
| `error` | `string` | `''` | Mensaje de error |

**Uso:**

```svelte
<script>
  import { Input } from '@swal/ui';
  let email = '';
  let errorMsg = '';
</script>

<Input
  bind:value={email}
  label="Email"
  type="email"
  placeholder="user@example.com"
  error={errorMsg}
/>

<Input bind:value={search} placeholder="Search..." />
```

---

### `<Skeleton>`

Placeholder de carga con animación pulse.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string` | `'100%'` | Ancho (cualquier valor CSS) |
| `height` | `string` | `'20px'` | Alto |
| `variant` | `'text' \| 'card' \| 'circle'` | `'text'` | Forma del skeleton |

**Uso:**

```svelte
<Skeleton width="200px" height="16px" />
<Skeleton variant="circle" width="40px" height="40px" />
<Skeleton variant="card" width="100%" />
```

---

## Motion Utilities

Import desde `@swal/ui/motion`:

```svelte
<script>
  import { swalFade, swalSlide } from '@swal/ui/motion';
</script>

<div use:swalFade={{ duration: 200 }}>
  Fade in content
</div>

<div use:swalSlide={{ direction: 'up', distance: 8, duration: 300 }}>
  Slide in content
</div>
```

### `swalFade(node, opts)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | `number` | `200` | Duración en ms |
| `delay` | `number` | `0` | Delay en ms |

### `swalSlide(node, opts)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | `number` | `200` | Duración en ms |
| `delay` | `number` | `0` | Delay en ms |
| `distance` | `number` | `8` | Distancia en px |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Dirección |

---

## Theming

### Edge-Hive (default)

El tema por defecto es Edge-Hive: fondo slate-950 oscuro con bordes sutiles `rgba(255,255,255,0.08)`, acento cyan (`#06b6d4`) y grid background opcional.

```css
/* Activar grid background en cualquier contenedor */
<div class="swal-grid-bg">...</div>
```

### Custom Accent

Para cambiar el color de acento, sobreescribe las variables en tu CSS:

```css
:root {
  --swal-accent: #10b981;         /* emerald */
  --swal-accent-hover: #34d399;
  --swal-accent-muted: rgba(16, 185, 129, 0.12);
  --swal-shadow-glow-cyan: 0 0 20px rgba(16, 185, 129, 0.15); /* rename if needed */
}
```

---

## Best Practices

1. **Import tokens una sola vez** en tu entry point (`main.ts`, `layout.astro`, `+layout.svelte`).
2. **Named imports** son más legibles: `import { Button, Card } from '@swal/ui'`.
3. **Motion utilities** son opcionales — solo importa si usas animaciones.
4. **CSS variables** están disponibles globalmente tras importar tokens.
5. **Svelte 5 compatible** — todos los componentes funcionan con Svelte 4 y 5.

---

## Package Exports

| Export path | Content |
|-------------|---------|
| `@swal/ui/tokens` | Design tokens CSS (theme.css + colors.css) |
| `@swal/ui/components/*` | Componentes Svelte individuales |
| `@swal/ui/motion` | Utilidades de animación (swalFade, swalSlide) |

---

## License

SWAL Ecosystem — Internal use only.
