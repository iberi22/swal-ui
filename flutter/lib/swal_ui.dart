/// SWAL design system para Flutter — tema "Bone Taller".
///
/// Bone (neutros de piedra, jerarquia por opacidad, glass tactil) + el naranja
/// de Taller como unico acento. Los colores, radios, espacios, sombras y
/// tiempos se generan desde los tokens CSS de `@swal/ui` (misma fuente que la
/// web) con `pnpm gen:flutter`.
///
/// ```dart
/// import 'package:swal_ui/swal_ui.dart';
///
/// MaterialApp(
///   theme: SwalTheme.light(),
///   darkTheme: SwalTheme.dark(),
///   themeMode: SwalThemeMode.system.themeMode,
///   home: Scaffold(body: SwalPage(child: SwalCard(child: Text('Hola')))),
/// );
/// ```
library;

export 'src/contrast.dart';
export 'src/palette.dart';
export 'src/theme.dart';
export 'src/theme_mode.dart';
export 'src/tokens.dart';
export 'src/tokens.g.dart' show SwalTokenValues;
export 'src/typography.dart' show SwalTypography, swalTextTheme;
export 'src/widgets/swal_brand.dart';
export 'src/widgets/swal_button.dart';
export 'src/widgets/swal_card.dart';
export 'src/widgets/swal_page.dart';
export 'src/widgets/swal_section.dart';
export 'src/widgets/swal_text_field.dart';
