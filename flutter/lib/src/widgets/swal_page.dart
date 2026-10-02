import 'package:flutter/material.dart';

import '../tokens.dart';

/// Contenido de pagina centrado, con ancho maximo y relleno responsive.
///
/// El relleno horizontal sigue el breakpoint del ancho disponible
/// (compact < 600: 16 · medium < 1024: 24 · expanded: 32) y el contenido nunca
/// pasa de [maxWidth]: en pantallas anchas queda una columna centrada, como
/// el `max-width` + `margin: auto` de la web.
///
/// Por defecto hace scroll vertical; con `scrollable: false` el hijo recibe
/// el alto disponible (util para listas propias o layouts con Expanded).
class SwalPage extends StatelessWidget {
  /// Crea una pagina.
  const SwalPage({
    super.key,
    required this.child,
    this.maxWidth = SwalTokens.pageMaxWidth,
    this.scrollable = true,
    this.padding,
    this.verticalPadding = SwalTokens.space6,
    this.controller,
  });

  /// Contenido de la pagina.
  final Widget child;

  /// Ancho maximo del contenido (sin contar el relleno).
  final double maxWidth;

  /// Si envuelve el contenido en un `SingleChildScrollView`.
  final bool scrollable;

  /// Relleno horizontal fijo; si es null, el del breakpoint.
  final double? padding;

  /// Relleno superior e inferior.
  final double verticalPadding;

  /// Controlador del scroll (solo con [scrollable]).
  final ScrollController? controller;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final breakpoint = SwalBreakpoint.fromWidth(constraints.maxWidth);
        final horizontal = padding ?? breakpoint.pagePadding;
        Widget content = Padding(
          padding: EdgeInsets.symmetric(
            horizontal: horizontal,
            vertical: verticalPadding,
          ),
          child: Align(
            alignment: Alignment.topCenter,
            heightFactor: scrollable ? 1 : null,
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: maxWidth),
              child: SizedBox(
                width: double.infinity,
                height: scrollable ? null : double.infinity,
                child: child,
              ),
            ),
          ),
        );
        if (scrollable) {
          content = SingleChildScrollView(
            controller: controller,
            child: content,
          );
        }
        return content;
      },
    );
  }
}
