# Changelog

Todas las novedades de `@swal/ui` se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y
el versionado es [SemVer](https://semver.org/lang/es/).

Las fechas son de commit (`git log`), no deDecision comercial: este paquete se
extrajo del dashboard de synapse-trading el 2026-07-30 y llega a npm como
0.2.0, asi que el historial anterior a esa fecha es pre-publicacion.

## [Unreleased]

Nada pendiente.

## [0.2.0] — 2026-10-03

Primera publicacion en npm. Sin cambios de API respecto a 0.1.0; el salto es
de empaquetado.

### Añadido

- **`exports['./ui.css']`**: hoja de entrada con los estilos de los
  componentes. Antes el CSS vivia en `dist/ui.css` pero no era alcanzable desde
  fuera, porque `files` excluia `dist/`. Sin ella, un componente Svelte
  consumido sin `client:*` se renderizaba con sus clases correctas y **cero
  reglas** que las aplicaran (botones con el aspecto nativo del navegador).
- **Condicion `default` en `exports['.']`**. Solo declaraba `svelte`, y
  cualquier resolutor que no aplique esa condicion —workerd, el runtime de
  `astro dev` con el adaptador de Cloudflare— no resolvia el paquete.
- **`dist` en `files`**, sin lo cual el CSS no viaja en el tarball aunque
  este exportado.
- **`prepublishOnly: pnpm run build`**, para que `dist/` nunca se publique
  vacio o con la build anterior.
- **`@swal/ui/prefs`**: preferencias de interfaz declarativas, con
  `OnboardingWizard`, `PrefsEditor` y `ThemeModeSwitch`.
- **Tema Taller dual** (plano tecnico claro / garaje oscuro) con modo
  `claro`/`oscuro`/`sistema`, exportado como `./taller.css` y `./theme-mode`.
- **Tema Bone como valor por defecto del ecosistema**, exportado como
  `./themes.css`, con registro y auditor (`themes:audit`, `themes:ecosistema`).
- **`LICENSE` y `NOTICE` incluidos en el tarball.**

### Cambiado

- **Licencia: MIT → Apache-2.0.** El repositorio anunciaba MIT en el README y
  AGPL-3.0 en `package.json`, `CLA.md`, `USAGE.md` y `SWAL_GOAL.md` — cuatro
  declaraciones y un `LICENSE` de plantilla sin copyright. Apache-2.0 es
  permisivo como MIT (sin copyleft, sin obligacion de abrir el servicio) y
  anade cesion explicita de patente, que importa en un design system pensado
  para que lo adopten varias organizaciones. Los cuatro documentos se
  alinearon con la licencia real.
- **Metadatos de npm**: `homepage`, `repository`, `bugs`, `author`,
  `contributors`, `keywords` y `engines`. Antes no habia ninguno, asi que la
  ficha del paquete no enlazaba al repositorio ni explicaba como reportar
  problemas.
- Presets de fuente (`data-font`) y selector en `ConfigFloatingWindow`.

### Corregido

- **Las variantes de tema no llegaban al bundle**, y el auditor de temas no
  miraba imports JS — se verificaba el `.css` cuando el problema estaba en el
  `.js` que lo genera.
- **`README.md` desalineado con el sistema real**: describia un tema que ya
  no era el valor por defecto.

## [0.1.0] — 2026-07-30

Extraccion del design system desde `apps/synapse-trading/dashboard` a
`cores/swal-ui`, como repo independiente.

### Añadido

- Primitivas Svelte 5 con CSS scoped y cero dependencias runtime: `Button`,
  `Card`, `Badge`, `Input`, `Table`, `Tabs`, `Skeleton`, `Modal`.
- Portados desde `edge-hive-admin`: `StatusBadge`, `LoadingState`,
  `Terminal`, `CommandPalette`, `Toaster`, `LogViewer`, `ConfigEditor`.
- Layout y navegacion: `DashboardLayout`, `GlobalTicker`, `Landing`.
- `QRCode`, usado por el sitio de GOS.
- Tokens CSS como hoja de entrada (`@swal/ui/tokens`), con el tema Bone.
- `svelte:compile` sin stores legacy: runes `$state`, `$derived`, `$props`,
  `$bindable`, `$effect`.

[Unreleased]: https://github.com/iberi22/swal-ui/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/iberi22/swal-ui/releases/tag/v0.2.0