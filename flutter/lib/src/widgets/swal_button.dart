import 'package:flutter/material.dart';

import '../palette.dart';
import '../tokens.dart';

/// Variantes de [SwalButton].
enum SwalButtonVariant {
  /// Relleno naranja: la accion principal de la pantalla (una sola).
  primary,

  /// Piedra con borde: acciones secundarias.
  secondary,

  /// Sin fondo: acciones terciarias, toolbars.
  ghost,

  /// Rojo semantico: acciones destructivas.
  danger,
}

/// Tamanos de [SwalButton].
enum SwalButtonSize {
  /// 36 px de alto: toolbars, tablas.
  small,

  /// 44 px de alto (objetivo tactil): el normal.
  medium,
}

/// Boton de SWAL. Se apoya en los botones de Material (`FilledButton`,
/// `OutlinedButton`, `TextButton`) que [SwalTheme] ya estiliza, asi que
/// teclado, foco, semantica y estados funcionan igual que en Material.
class SwalButton extends StatelessWidget {
  /// Crea un boton con [variant].
  const SwalButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = SwalButtonVariant.primary,
    this.icon,
    this.size = SwalButtonSize.medium,
    this.loading = false,
    this.expand = false,
  });

  /// Accion principal (naranja).
  const SwalButton.primary({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.size = SwalButtonSize.medium,
    this.loading = false,
    this.expand = false,
  }) : variant = SwalButtonVariant.primary;

  /// Accion secundaria (piedra).
  const SwalButton.secondary({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.size = SwalButtonSize.medium,
    this.loading = false,
    this.expand = false,
  }) : variant = SwalButtonVariant.secondary;

  /// Accion terciaria (sin fondo).
  const SwalButton.ghost({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.size = SwalButtonSize.medium,
    this.loading = false,
    this.expand = false,
  }) : variant = SwalButtonVariant.ghost;

  /// Accion destructiva (rojo semantico).
  const SwalButton.danger({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.size = SwalButtonSize.medium,
    this.loading = false,
    this.expand = false,
  }) : variant = SwalButtonVariant.danger;

  /// Texto del boton.
  final String label;

  /// Accion; null deshabilita el boton.
  final VoidCallback? onPressed;

  /// Variante visual.
  final SwalButtonVariant variant;

  /// Icono opcional delante del texto.
  final IconData? icon;

  /// Tamano.
  final SwalButtonSize size;

  /// Muestra un indicador de progreso y bloquea el boton.
  final bool loading;

  /// Ocupa todo el ancho disponible.
  final bool expand;

  ButtonStyle? _style(SwalPalette p) {
    ButtonStyle? style;
    if (variant == SwalButtonVariant.danger) {
      // En claro se oscurece y en oscuro se aclara: asi el hover nunca baja el
      // contraste del texto por debajo del de reposo.
      final veil = (p.isDark ? Colors.white : Colors.black).withValues(
        alpha: 0.1,
      );
      style = ButtonStyle(
        backgroundColor: WidgetStateProperty.resolveWith((s) {
          if (s.contains(WidgetState.disabled)) return p.over(p.surfaceActive);
          if (s.contains(WidgetState.hovered) ||
              s.contains(WidgetState.pressed) ||
              s.contains(WidgetState.focused)) {
            return Color.alphaBlend(veil, p.danger);
          }
          return p.danger;
        }),
        foregroundColor: WidgetStateProperty.resolveWith(
          (s) => s.contains(WidgetState.disabled) ? p.textFaint : p.onDanger,
        ),
        iconColor: WidgetStateProperty.resolveWith(
          (s) => s.contains(WidgetState.disabled) ? p.textFaint : p.onDanger,
        ),
        side: WidgetStateProperty.resolveWith(
          (s) => s.contains(WidgetState.focused)
              ? BorderSide(color: p.onDanger, width: 2)
              : BorderSide.none,
        ),
      );
    }
    if (size == SwalButtonSize.small) {
      const small = ButtonStyle(
        minimumSize: WidgetStatePropertyAll(Size(48, 36)),
        padding: WidgetStatePropertyAll(
          EdgeInsets.symmetric(
            horizontal: SwalTokens.space3,
            vertical: SwalTokens.space2,
          ),
        ),
        // Sin el relleno de objetivo tactil de 48: el pequeno es para
        // toolbars de escritorio y debe medir lo que dice.
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      );
      style = style?.merge(small) ?? small;
    }
    return style;
  }

  @override
  Widget build(BuildContext context) {
    final p = SwalPalette.of(context);
    final style = _style(p);
    final action = loading ? null : onPressed;

    Widget? leading;
    if (loading) {
      leading = SizedBox.square(
        dimension: 16,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          color: switch (variant) {
            SwalButtonVariant.primary => p.onAccent,
            SwalButtonVariant.danger => p.onDanger,
            _ => p.textSecondary,
          },
        ),
      );
    } else if (icon != null) {
      leading = Icon(icon);
    }
    final child = Text(label, overflow: TextOverflow.ellipsis, maxLines: 1);

    Widget button = switch (variant) {
      SwalButtonVariant.primary || SwalButtonVariant.danger =>
        leading == null
            ? FilledButton(onPressed: action, style: style, child: child)
            : FilledButton.icon(
                onPressed: action,
                style: style,
                icon: leading,
                label: child,
              ),
      SwalButtonVariant.secondary =>
        leading == null
            ? OutlinedButton(onPressed: action, style: style, child: child)
            : OutlinedButton.icon(
                onPressed: action,
                style: style,
                icon: leading,
                label: child,
              ),
      SwalButtonVariant.ghost =>
        leading == null
            ? TextButton(onPressed: action, style: style, child: child)
            : TextButton.icon(
                onPressed: action,
                style: style,
                icon: leading,
                label: child,
              ),
    };

    if (expand) button = SizedBox(width: double.infinity, child: button);
    return button;
  }
}
