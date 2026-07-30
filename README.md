# @swal/ui — SWAL Design System

Core UI reutilizable para todas las apps del ecosistema SWAL.
Tema **Edge-Hive**, portado fielmente desde `edge-hive-admin` (React) a **Svelte 5**.

## Stack
- **Svelte 5** (runes) — componentes compilados, sin runtime pesado
- **CSS scoped + design tokens** — cero dependencias: no requiere Tailwind, Radix ni librerías de animación
- **Svelte transitions** — transiciones nativas GPU

## Filosofía
- Cero dependencias: funciona igual en Astro, SvelteKit o Vite pelado
- CSS-first: tokens en `:root`, utilidades de clase, animaciones por CSS
- Móvil/PWA: safe-area insets, `100dvh`, `touch-action`, `prefers-reduced-motion`

## Componentes
**Primitivos:** Button, Card, Badge, Input, Table, Tabs, Skeleton, Modal
**Edge-Hive:** StatusBadge, LoadingState, Terminal, CommandPalette, Toaster (+ store `toast`)

## Tema
Dark slate (`#020617`) con acentos cyan (`#06b6d4`) y orange (`#f97316`).
Fuentes: Inter (UI) + Fira Code (datos/terminal).
Utilidades: `.swal-scrollbar`, `.swal-neon-cyan/orange`, `.swal-scanline`,
`.swal-grid-bg`, `.swal-glass`, `.swal-marquee`, `.swal-safe-area`, etc.

Ver [USAGE.md](./USAGE.md) para la guía completa.
