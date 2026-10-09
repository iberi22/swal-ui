import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../palette.dart';
import '../tokens.dart';

/// Marca de SWAL: la senal naranja de Taller (un paralelogramo, `.swal-tick`
/// en la web), el wordmark "SWAL" y, opcionalmente, el nombre del producto.
///
/// `SwalBrandMark(product: 'Fize')` → ▰ SWAL · Fize
class SwalBrandMark extends StatelessWidget {
  /// Crea la marca.
  const SwalBrandMark({
    super.key,
    this.product,
    this.size = 18,
    this.showTick = true,
  });

  /// Nombre del producto tras el wordmark; null muestra solo "SWAL".
  final String? product;

  /// Tamano de letra del wordmark.
  final double size;

  /// Muestra la senal naranja delante.
  final bool showTick;

  @override
  Widget build(BuildContext context) {
    final p = SwalPalette.of(context);
    final base = Theme.of(context).textTheme.titleLarge ?? const TextStyle();
    final wordmark = base.copyWith(
      fontSize: size,
      fontWeight: FontWeight.w700,
      letterSpacing: size * 0.12,
      color: p.text,
      height: 1,
    );
    return Semantics(
      label: product == null ? 'SWAL' : 'SWAL $product',
      excludeSemantics: true,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (showTick) ...[
            Transform(
              // skewX(-24deg), como la web.
              transform: Matrix4.skewX(-24 * math.pi / 180),
              alignment: Alignment.center,
              child: SizedBox(
                width: size * 0.6,
                height: size * 0.42,
                child: ColoredBox(color: p.accent),
              ),
            ),
            SizedBox(width: size * 0.5),
          ],
          Text('SWAL', style: wordmark),
          if (product != null) ...[
            Padding(
              padding: EdgeInsets.symmetric(horizontal: size * 0.45),
              child: Text('·', style: wordmark.copyWith(color: p.textFaint)),
            ),
            // Flexible: en una AppBar estrecha el producto se recorta con
            // elipsis en vez de desbordar la fila.
            Flexible(
              child: Text(
                product!,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: wordmark.copyWith(
                  fontWeight: FontWeight.w500,
                  letterSpacing: 0,
                  color: p.textSecondary,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Estados semanticos de [SwalStatusBadge].
enum SwalStatus {
  /// Correcto / pagado / en linea.
  success,

  /// Pendiente / atencion.
  warning,

  /// Error / vencido / caido.
  danger,

  /// Informativo.
  info,

  /// Sin estado (piedra).
  neutral,
}

/// Ficha de estado: punto + texto en el color SEMANTICO del estado sobre su
/// fondo apagado. Es el unico sitio donde el tema usa color fuera del acento.
class SwalStatusBadge extends StatelessWidget {
  /// Crea una ficha.
  const SwalStatusBadge({
    super.key,
    required this.label,
    this.status = SwalStatus.neutral,
    this.showDot = true,
  });

  /// Texto de la ficha.
  final String label;

  /// Estado semantico.
  final SwalStatus status;

  /// Muestra el punto de color delante del texto.
  final bool showDot;

  @override
  Widget build(BuildContext context) {
    final p = SwalPalette.of(context);
    final (Color fg, Color bg) = switch (status) {
      SwalStatus.success => (p.success, p.successMuted),
      SwalStatus.warning => (p.warning, p.warningMuted),
      SwalStatus.danger => (p.danger, p.dangerMuted),
      SwalStatus.info => (p.info, p.infoMuted),
      SwalStatus.neutral => (p.textSecondary, p.hover),
    };
    final style = Theme.of(context).textTheme.labelMedium?.copyWith(
      color: fg,
      fontWeight: FontWeight.w600,
      height: 1.2,
    );
    return DecoratedBox(
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(SwalTokens.radiusFull),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: SwalTokens.space2 + 2,
          vertical: SwalTokens.space1,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (showDot) ...[
              DecoratedBox(
                decoration: BoxDecoration(color: fg, shape: BoxShape.circle),
                child: const SizedBox.square(dimension: 6),
              ),
              const SizedBox(width: SwalTokens.space1 + 2),
            ],
            Text(label, style: style),
          ],
        ),
      ),
    );
  }
}
