# swal_ui (Flutter)

Design system de SWAL para Flutter. Tema **Bone Taller**: los neutros de piedra
del tema Bone de la web (Papel Alabastro `#FAF9F5` / Carbon Mineral `#121211`,
jerarquia por opacidad, glass tactil) con el naranja de Taller `#FF6A13` como
**unico** acento: accion primaria, anillo de foco, seleccion y navegacion activa.
El resto es piedra; los unicos otros colores son semanticos (exito, aviso, error, info).

Material 3 normal (`ThemeData`), sin dependencias aparte de Flutter. Requiere
Flutter >= 3.32 / Dart >= 3.8.

## Instalar

No esta en pub.dev: se usa como dependencia git, fijada a un commit o tag.

```yaml
dependencies:
  swal_ui:
    git:
      url: https://github.com/iberi22/swal-ui
      path: flutter
      ref: <tag-o-sha>   # p. ej. el SHA del commit que quieras fijar
```

## Uso

```dart
import 'package:swal_ui/swal_ui.dart';

MaterialApp(
  theme: SwalTheme.light(),
  darkTheme: SwalTheme.dark(),
  themeMode: SwalThemeMode.system.themeMode, // light | dark | system
  home: Scaffold(
    appBar: AppBar(title: const SwalBrandMark(product: 'Fize')),
    body: SwalPage(
      child: Column(children: [
        const SwalSectionHeader(kicker: 'Facturacion', title: 'Facturas'),
        SwalCard(child: Text('Hola')),
        SwalButton.primary(label: 'Pagar', onPressed: () {}),
      ]),
    ),
  ),
);
```

| API | Que es |
|-----|--------|
| `SwalTheme.light()` / `.dark()` / `.of(brightness)` / `.fromPalette(p)` | `ThemeData` M3 completo: ColorScheme, escala tipografica, botones Filled/Outlined/Text/Icon, InputDecoration, Card, Dialog, SnackBar, AppBar plana, Divider, Chip, ListTile, NavigationBar/Rail/Drawer, TabBar, Checkbox/Radio/Switch, Tooltip, Menu. `bundledFonts: false` usa las fuentes del sistema. |
| `SwalThemeMode` | `light` / `dark` / `system`; `.themeMode`, `.resolve()`, `.next`, `parse()`. Los valores y la clave (`swal:theme-mode`) son los de `@swal/ui/theme-mode` en la web. |
| `SwalPalette` | `ThemeExtension` con todos los tokens de color (`SwalPalette.of(context).accentText`) y sombras. `over()` compone un color translucido sobre el canvas. |
| `SwalTypography` | `ThemeExtension` con `mono` (JetBrains Mono, solo datos) y `kicker` (rotulo mono en mayusculas). |
| `SwalTokens` | Espacio 4/8/12/16/24/32/48, radios, duraciones y curvas, breakpoints (compact < 600, medium < 1024, expanded), `pageMaxWidth`. |
| `SwalBreakpoint` | `fromWidth(w)` y `pagePadding` (16 / 24 / 32). |
| `SwalContrast` | `ratio()` y `composite()` WCAG 2.2, para comprobar colores propios. |
| `SwalPage` | Contenido centrado con ancho maximo y relleno responsive; scroll opcional. |
| `SwalCard` | Glass tactil: superficie translucida + borde 1px + sombra difusa; `blur`, `elevated`, `selected`, `onTap`. |
| `SwalButton` | `.primary` (naranja) / `.secondary` (piedra) / `.ghost` / `.danger`; `icon`, `loading`, `expand`, `size`. |
| `SwalTextField` | Etiqueta encima, ayuda / error debajo, `mono` para datos. |
| `SwalSectionHeader` | Rotulo + titulo + subtitulo + accion a la derecha. |
| `SwalEmptyState` | Icono, titulo, mensaje y accion. |
| `SwalBrandMark` | Senal naranja + wordmark "SWAL" + nombre del producto. |
| `SwalStatusBadge` | `SwalStatus.success / warning / danger / info / neutral`: el unico color fuera del acento. |

Reglas del tema (las mismas que en la web):

- El naranja de **relleno** (`accent`) no es legible como texto sobre papel (2.72:1).
  Texto o icono naranja → `accentText`; texto sobre naranja → `onAccent` (piedra `#1C1917`).
- Una sola accion primaria por pantalla. Lo demas, `secondary` o `ghost`.
- `textFaint` es decorativo (no pasa AA); para metadatos usa `textMuted`.

## Tokens: generados desde la web

`lib/src/tokens.g.dart` **no se edita a mano**. Lo escribe
`scripts/gen-flutter-tokens.mjs` (raiz del repo) a partir de:

- `src/tokens/theme.css` — tema Bone: neutros, semanticos, sombras, radios, espacio, tiempos.
- `src/tokens/bone-taller.css` — la capa de acento naranja (la combinacion se define AQUI, una vez).
- `src/tokens/taller.css` — solo se compara: el generador falla si el naranja de
  `bone-taller.css` deja de ser el de Taller.

```bash
pnpm gen:flutter                                   # regenerar
node scripts/gen-flutter-tokens.mjs --check        # exit 1 si esta desactualizado
```

`pnpm test` incluye `tests/flutter-tokens.test.js`, que falla si alguien cambia un
token CSS y no regenera el archivo Dart.

### Mapeo de tokens

| Token CSS | Campo Dart | Claro | Oscuro |
|-----------|-----------|-------|--------|
| `--swal-bg` | `bg` | `#FAF9F5` | `#121211` |
| `--swal-surface` | `surface` | `rgba(255,255,255,.9)` | `rgba(28,25,23,.85)` |
| `--swal-elevated` | `elevated` | `rgba(255,255,255,.95)` | `rgba(28,27,25,.92)` |
| `--swal-border` | `border` | `rgba(231,229,228,.8)` | `rgba(68,64,60,.5)` |
| `--swal-text` | `text` | `#1C1917` | `#F5F5F4` |
| `--swal-text-secondary` | `textSecondary` | `#1C1917` al 78 % | `#F5F5F4` al 74 % |
| `--swal-text-muted` | `textMuted` | `#1C1917` al 65 % | `#F5F5F4` al 55 % |
| `--swal-accent` | `accent` | `#FF6A13` | `#FF6A13` |
| `--swal-accent-hover` | `accentHover` | `#E85A06` | `#FF8A45` |
| `--swal-accent-muted` | `accentMuted` | `#FF6A13` al 12 % | `#FF6A13` al 16 % |
| `--swal-accent-text` | `accentText` | `#B44709` | `#FF8A45` |
| `--swal-on-accent` | `onAccent` | `#1C1917` | `#1C1917` |
| `--swal-focus-ring` | `focusRing` | `#B44709` | `#FF6A13` |
| `--swal-selection` | `selection` | `#FF6A13` al 24 % | `#FF6A13` al 32 % |
| `--swal-success / warning / danger / info` | `success` ... | `#047857` `#B45309` `#DC2626` `#0369A1` | `#34D399` `#FBBF24` `#FB7185` `#7DD3FC` |
| `--swal-shadow(-sm/-lg)` | `shadow` ... | `BoxShadow` | `BoxShadow` |
| `--swal-radius-*`, `--swal-space-*`, `--swal-transition*` | `SwalTokenValues.*` → `SwalTokens.*` | — | — |

La lista completa con valores esta en `lib/src/tokens.g.dart` (cada linea lleva su token CSS).

## Fuentes

Inter (400/500/600/700) y JetBrains Mono (400/600), SIL Open Font License 1.1
(`fonts/OFL-*.txt`). Son instancias estaticas de las fuentes variables originales,
recortadas a latin + latin extendido A, puntuacion y simbolos (~450 KB en total).
Con `SwalTheme.light(bundledFonts: false)` se usan las fuentes del sistema.

## Galeria

```bash
cd flutter/example
flutter run -d linux
```

## Desarrollo

```bash
cd flutter
flutter pub get && flutter analyze && flutter test
```
