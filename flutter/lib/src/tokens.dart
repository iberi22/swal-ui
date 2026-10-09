import 'package:flutter/animation.dart';

import 'tokens.g.dart';

/// Tamano de ventana segun los breakpoints de SWAL.
///
/// compact < 600 <= medium < 1024 <= expanded.
enum SwalBreakpoint {
  /// Movil (< 600 px).
  compact,

  /// Tableta / ventana estrecha (600 - 1023 px).
  medium,

  /// Escritorio (>= 1024 px).
  expanded;

  /// Breakpoint para un ancho disponible.
  static SwalBreakpoint fromWidth(double width) {
    if (width < SwalTokens.breakpointMedium) return compact;
    if (width < SwalTokens.breakpointExpanded) return medium;
    return expanded;
  }

  /// Relleno horizontal de pagina para este breakpoint (16 / 24 / 32).
  double get pagePadding => switch (this) {
    compact => SwalTokens.space4,
    medium => SwalTokens.space6,
    expanded => SwalTokens.space8,
  };
}

/// Tokens de geometria, espacio y tiempo de SWAL.
///
/// Los que existen en la web salen de `tokens.g.dart` (generado desde
/// `src/tokens/theme.css`); los breakpoints y el ancho de pagina son propios
/// de Flutter y viven aqui.
abstract final class SwalTokens {
  // ─── Espacio (escala 4 / 8 / 12 / 16 / 24 / 32 / 48) ───

  /// 4 px — `--swal-space-1`.
  static const double space1 = SwalTokenValues.space1;

  /// 8 px — `--swal-space-2`.
  static const double space2 = SwalTokenValues.space2;

  /// 12 px — `--swal-space-3`.
  static const double space3 = SwalTokenValues.space3;

  /// 16 px — `--swal-space-4`.
  static const double space4 = SwalTokenValues.space4;

  /// 24 px — `--swal-space-6`.
  static const double space6 = SwalTokenValues.space6;

  /// 32 px — `--swal-space-8`.
  static const double space8 = SwalTokenValues.space8;

  /// 48 px — `--swal-space-12`.
  static const double space12 = SwalTokenValues.space12;

  /// La escala completa, de menor a mayor.
  static const List<double> spacing = <double>[
    space1,
    space2,
    space3,
    space4,
    space6,
    space8,
    space12,
  ];

  // ─── Radios ───

  /// 6 px — chips, badges cuadrados.
  static const double radiusXs = SwalTokenValues.radiusXs;

  /// 8 px — list tiles, items de menu.
  static const double radiusSm = SwalTokenValues.radiusSm;

  /// 12 px — botones, inputs.
  static const double radius = SwalTokenValues.radius;

  /// 16 px — tarjetas.
  static const double radiusLg = SwalTokenValues.radiusLg;

  /// 24 px — dialogos, paneles grandes.
  static const double radiusXl = SwalTokenValues.radiusXl;

  /// Pill / avatar.
  static const double radiusFull = SwalTokenValues.radiusFull;

  // ─── Tiempo ───

  /// 120 ms — hover, pequenos cambios de color.
  static const Duration durationFast = SwalTokenValues.durationFast;

  /// 180 ms — transicion por defecto.
  static const Duration duration = SwalTokenValues.duration;

  /// 280 ms — entrada de paneles.
  static const Duration durationSlow = SwalTokenValues.durationSlow;

  /// Curva por defecto (`cubic-bezier(0.4, 0, 0.2, 1)`).
  static const Curve curve = SwalTokenValues.easeStandard;

  /// Curva de entrada (`--swal-ease-out`).
  static const Curve curveOut = SwalTokenValues.easeOut;

  /// Curva de salida (`--swal-ease-in`).
  static const Curve curveIn = SwalTokenValues.easeIn;

  // ─── Layout ───

  /// Inicio del breakpoint medium.
  static const double breakpointMedium = 600;

  /// Inicio del breakpoint expanded.
  static const double breakpointExpanded = 1024;

  /// Ancho maximo por defecto del contenido de [SwalPage].
  static const double pageMaxWidth = 1120;

  /// Alto minimo de un objetivo tactil (botones, inputs).
  static const double minTapTarget = 44;
}
