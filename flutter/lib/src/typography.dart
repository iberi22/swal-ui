import 'package:flutter/material.dart';

import 'palette.dart';
import 'tokens.g.dart';

/// Paquete que trae las fuentes Inter y JetBrains Mono (OFL 1.1).
const String _package = 'swal_ui';

/// Familias tipograficas de SWAL y estilos que Material no tiene.
///
/// Sans = Inter (UI, titulos, cuerpo). Mono = JetBrains Mono, SOLO para datos:
/// rutas, codigos, cifras alineadas, el rotulo tecnico [kicker].
@immutable
class SwalTypography extends ThemeExtension<SwalTypography> {
  /// Crea los estilos extra. Normalmente se usa [SwalTypography.forPalette].
  const SwalTypography({required this.mono, required this.kicker});

  /// Estilos para [palette]; con [bundledFonts] usa las fuentes del paquete,
  /// sin el las del sistema.
  factory SwalTypography.forPalette(
    SwalPalette palette, {
    bool bundledFonts = true,
  }) {
    final mono = TextStyle(
      fontFamily: bundledFonts ? monoFamily : 'JetBrains Mono',
      fontFamilyFallback: monoFallback,
      fontSize: SwalTokenValues.fontSize,
      height: 1.5,
      color: palette.text,
    );
    return SwalTypography(
      mono: mono,
      kicker: mono.copyWith(
        fontSize: SwalTokenValues.fontSizeXs,
        letterSpacing: 1.5,
        fontWeight: FontWeight.w600,
        color: palette.textMuted,
      ),
    );
  }

  /// Familia sans empaquetada (`packages/swal_ui/Inter`).
  static const String sansFamily = 'packages/$_package/Inter';

  /// Familia mono empaquetada (`packages/swal_ui/JetBrains Mono`).
  static const String monoFamily = 'packages/$_package/JetBrains Mono';

  /// Respaldo sans: el resto de la pila de `--swal-font`.
  static List<String> get sansFallback =>
      SwalTokenValues.fontSans.where((f) => f != 'Inter').toList();

  /// Respaldo mono: la pila de `--swal-font-mono` y las monoespaciadas nativas.
  static List<String> get monoFallback => <String>[
    ...SwalTokenValues.fontMono.where((f) => f != 'JetBrains Mono'),
    'Menlo',
    'Consolas',
    'Roboto Mono',
    'monospace',
  ];

  /// Estilos del tema actual; si no estan instalados, los del brillo actual.
  static SwalTypography of(BuildContext context) {
    return Theme.of(context).extension<SwalTypography>() ??
        SwalTypography.forPalette(SwalPalette.of(context));
  }

  /// Monoespaciada para datos (14 px).
  final TextStyle mono;

  /// Rotulo tecnico: mono 11 px, mayusculas espaciadas, apagado.
  /// Equivale a `.swal-kicker` de la web; el texto se pasa ya en mayusculas.
  final TextStyle kicker;

  @override
  SwalTypography copyWith({TextStyle? mono, TextStyle? kicker}) {
    return SwalTypography(
      mono: mono ?? this.mono,
      kicker: kicker ?? this.kicker,
    );
  }

  @override
  SwalTypography lerp(
    covariant ThemeExtension<SwalTypography>? other,
    double t,
  ) {
    if (other is! SwalTypography) return this;
    return SwalTypography(
      mono: TextStyle.lerp(mono, other.mono, t)!,
      kicker: TextStyle.lerp(kicker, other.kicker, t)!,
    );
  }
}

/// Escala tipografica de SWAL sobre la de Material 3.
///
/// Tamanos de `--swal-font-size-*` (11 / 13 / 14 / 16 / 20 / 24) mas tres de
/// display. Titulos en 600 con tracking negativo leve; cuerpo con aire (1.5).
TextTheme swalTextTheme(SwalPalette p) {
  TextStyle s(
    double size,
    FontWeight weight, {
    double height = 1.3,
    double letterSpacing = 0,
    Color? color,
  }) => TextStyle(
    fontSize: size,
    fontWeight: weight,
    height: height,
    letterSpacing: letterSpacing,
    color: color ?? p.text,
  );

  return TextTheme(
    displayLarge: s(40, FontWeight.w600, height: 1.1, letterSpacing: -0.8),
    displayMedium: s(32, FontWeight.w600, height: 1.15, letterSpacing: -0.6),
    displaySmall: s(28, FontWeight.w600, height: 1.2, letterSpacing: -0.4),
    headlineLarge: s(
      SwalTokenValues.fontSize2xl,
      FontWeight.w600,
      letterSpacing: -0.3,
    ),
    headlineMedium: s(
      SwalTokenValues.fontSizeXl,
      FontWeight.w600,
      letterSpacing: -0.2,
    ),
    headlineSmall: s(18, FontWeight.w600, letterSpacing: -0.1),
    titleLarge: s(18, FontWeight.w600, letterSpacing: -0.1),
    titleMedium: s(SwalTokenValues.fontSizeLg, FontWeight.w600),
    titleSmall: s(SwalTokenValues.fontSize, FontWeight.w600),
    bodyLarge: s(SwalTokenValues.fontSizeLg, FontWeight.w400, height: 1.5),
    bodyMedium: s(SwalTokenValues.fontSize, FontWeight.w400, height: 1.5),
    bodySmall: s(
      SwalTokenValues.fontSizeSm,
      FontWeight.w400,
      height: 1.45,
      color: p.textSecondary,
    ),
    labelLarge: s(SwalTokenValues.fontSize, FontWeight.w500, height: 1.2),
    labelMedium: s(SwalTokenValues.fontSizeSm, FontWeight.w500, height: 1.2),
    labelSmall: s(
      SwalTokenValues.fontSizeXs,
      FontWeight.w500,
      height: 1.2,
      letterSpacing: 0.2,
      color: p.textMuted,
    ),
  );
}
