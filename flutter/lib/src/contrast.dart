import 'dart:math' as math;

import 'package:flutter/painting.dart';

/// Herramientas de contraste WCAG 2.2, las mismas formulas con las que se
/// midieron los tokens CSS. Las usan los tests del tema y sirven a una app
/// que quiera comprobar un color propio antes de usarlo.
abstract final class SwalContrast {
  /// Minimo AA para texto normal.
  static const double aaText = 4.5;

  /// Minimo AA para texto grande y elementos no textuales (foco, bordes).
  static const double aaNonText = 3;

  /// [foreground] compuesto sobre [background]; el fondo se vuelve opaco
  /// sobre negro si tambien es translucido.
  static Color composite(Color foreground, Color background) {
    final opaqueBg = Color.alphaBlend(background, const Color(0xFF000000));
    return Color.alphaBlend(foreground, opaqueBg);
  }

  /// Relacion de contraste (1..21) de [foreground] sobre [background],
  /// componiendo la transparencia como la ve el ojo.
  static double ratio(Color foreground, Color background) {
    final bg = composite(background, const Color(0xFF000000));
    final fg = composite(foreground, bg);
    final a = fg.computeLuminance();
    final b = bg.computeLuminance();
    return (math.max(a, b) + 0.05) / (math.min(a, b) + 0.05);
  }
}
