import 'dart:ui' show ImageFilter;

import 'package:flutter/material.dart';

import '../palette.dart';
import '../tokens.dart';

/// Tarjeta de "glass tactil": superficie de piedra al 85-90 %, borde de 1px
/// y sombra difusa. Equivale a `.swal-glass` / `<Card>` de la web.
///
/// [blur] activa un `BackdropFilter` (16px, como la web). Es caro en GPUs
/// moviles: usalo en superficies pequenas sobre contenido con relieve
/// (barras flotantes, popovers), no en cada tarjeta de una lista.
class SwalCard extends StatelessWidget {
  /// Crea una tarjeta.
  const SwalCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(SwalTokens.space4),
    this.blur = false,
    this.elevated = false,
    this.selected = false,
    this.onTap,
    this.radius = SwalTokens.radiusLg,
  });

  /// Contenido.
  final Widget child;

  /// Relleno interior (16 por defecto).
  final EdgeInsetsGeometry padding;

  /// Desenfoque de lo que hay detras (backdrop-blur).
  final bool blur;

  /// Sombra mayor (`--swal-shadow-lg`) para paneles flotantes.
  final bool elevated;

  /// Marca la tarjeta como elegida: borde y fondo de acento.
  final bool selected;

  /// Si no es null, la tarjeta es pulsable (hover, foco y ripple).
  final VoidCallback? onTap;

  /// Radio de las esquinas.
  final double radius;

  @override
  Widget build(BuildContext context) {
    final p = SwalPalette.of(context);
    final shape = BorderRadius.circular(radius);
    final borderColor = selected ? p.accent : p.border;

    Widget content = Padding(padding: padding, child: child);
    if (onTap != null) {
      content = Material(
        type: MaterialType.transparency,
        child: InkWell(
          onTap: onTap,
          borderRadius: shape,
          hoverColor: p.hover,
          splashColor: p.hover,
          highlightColor: Colors.transparent,
          focusColor: p.accentMuted,
          child: content,
        ),
      );
    }

    Widget surface = DecoratedBox(
      decoration: BoxDecoration(
        color: selected
            ? Color.alphaBlend(p.accentMuted, p.surface)
            : p.surface,
        borderRadius: shape,
        border: Border.all(color: borderColor),
      ),
      child: content,
    );
    if (blur) {
      surface = BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: surface,
      );
    }

    return DecoratedBox(
      // La sombra va fuera del recorte para que no la corte el ClipRRect.
      decoration: BoxDecoration(
        borderRadius: shape,
        boxShadow: elevated ? p.shadowLg : p.shadow,
      ),
      child: ClipRRect(borderRadius: shape, child: surface),
    );
  }
}
