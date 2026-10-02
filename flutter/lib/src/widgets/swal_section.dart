import 'package:flutter/material.dart';

import '../palette.dart';
import '../tokens.dart';
import '../typography.dart';

/// Cabecera de seccion: rotulo tecnico opcional, titulo, subtitulo y una
/// accion a la derecha (boton, enlace, filtro).
class SwalSectionHeader extends StatelessWidget {
  /// Crea una cabecera.
  const SwalSectionHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.kicker,
    this.trailing,
    this.padding = const EdgeInsets.only(bottom: SwalTokens.space4),
  });

  /// Titulo de la seccion.
  final String title;

  /// Linea de apoyo bajo el titulo.
  final String? subtitle;

  /// Rotulo mono en mayusculas sobre el titulo (p. ej. "FACTURACION").
  final String? kicker;

  /// Accion alineada a la derecha.
  final Widget? trailing;

  /// Relleno exterior.
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final p = SwalPalette.of(context);
    final text = Theme.of(context).textTheme;
    return Padding(
      padding: padding,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                if (kicker != null) ...[
                  Text(
                    kicker!.toUpperCase(),
                    style: SwalTypography.of(context).kicker,
                  ),
                  const SizedBox(height: SwalTokens.space1),
                ],
                Semantics(
                  header: true,
                  child: Text(title, style: text.headlineMedium),
                ),
                if (subtitle != null) ...[
                  const SizedBox(height: SwalTokens.space1),
                  Text(
                    subtitle!,
                    style: text.bodyMedium?.copyWith(color: p.textSecondary),
                  ),
                ],
              ],
            ),
          ),
          if (trailing != null) ...[
            const SizedBox(width: SwalTokens.space3),
            trailing!,
          ],
        ],
      ),
    );
  }
}

/// Estado vacio: icono en un circulo de piedra, titulo, mensaje y accion.
class SwalEmptyState extends StatelessWidget {
  /// Crea un estado vacio.
  const SwalEmptyState({
    super.key,
    required this.title,
    this.message,
    this.icon = Icons.inbox_outlined,
    this.action,
    this.maxWidth = 360,
  });

  /// Que falta ("Todavia no hay facturas").
  final String title;

  /// Que hacer para que deje de estar vacio.
  final String? message;

  /// Icono ilustrativo.
  final IconData icon;

  /// Accion principal (normalmente un [SwalButton]).
  final Widget? action;

  /// Ancho maximo del texto.
  final double maxWidth;

  @override
  Widget build(BuildContext context) {
    final p = SwalPalette.of(context);
    final text = Theme.of(context).textTheme;
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: SwalTokens.space8),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DecoratedBox(
                decoration: BoxDecoration(
                  color: p.surface,
                  shape: BoxShape.circle,
                  border: Border.all(color: p.border),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(SwalTokens.space4),
                  child: Icon(icon, size: 28, color: p.textMuted),
                ),
              ),
              const SizedBox(height: SwalTokens.space4),
              Text(title, style: text.titleMedium, textAlign: TextAlign.center),
              if (message != null) ...[
                const SizedBox(height: SwalTokens.space2),
                Text(
                  message!,
                  style: text.bodyMedium?.copyWith(color: p.textSecondary),
                  textAlign: TextAlign.center,
                ),
              ],
              if (action != null) ...[
                const SizedBox(height: SwalTokens.space6),
                action!,
              ],
            ],
          ),
        ),
      ),
    );
  }
}
