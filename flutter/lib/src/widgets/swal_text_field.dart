import 'package:flutter/material.dart';

import '../palette.dart';
import '../tokens.dart';
import '../typography.dart';

/// Campo de texto de SWAL: etiqueta ENCIMA del campo (no flotante, como la
/// web), relleno de vidrio, borde de 1px y anillo de foco naranja de 2px.
///
/// Es un `TextField` normal debajo; los parametros mas comunes se exponen
/// aqui y el resto se configura con [decoration].
class SwalTextField extends StatelessWidget {
  /// Crea un campo de texto.
  const SwalTextField({
    super.key,
    this.label,
    this.hint,
    this.helper,
    this.errorText,
    this.controller,
    this.focusNode,
    this.initialValue,
    this.onChanged,
    this.onSubmitted,
    this.keyboardType,
    this.textInputAction,
    this.autofillHints,
    this.obscureText = false,
    this.enabled = true,
    this.readOnly = false,
    this.autofocus = false,
    this.mono = false,
    this.maxLines = 1,
    this.minLines,
    this.prefixIcon,
    this.suffix,
    this.decoration,
  }) : assert(
         controller == null || initialValue == null,
         'Usa controller o initialValue, no los dos.',
       );

  /// Etiqueta sobre el campo.
  final String? label;

  /// Texto de ejemplo dentro del campo vacio.
  final String? hint;

  /// Ayuda bajo el campo.
  final String? helper;

  /// Error bajo el campo; si no es null el borde pasa a rojo.
  final String? errorText;

  /// Controlador del texto.
  final TextEditingController? controller;

  /// Nodo de foco.
  final FocusNode? focusNode;

  /// Valor inicial si no hay [controller].
  final String? initialValue;

  /// Se llama en cada cambio.
  final ValueChanged<String>? onChanged;

  /// Se llama al enviar (tecla Enter / accion del teclado).
  final ValueChanged<String>? onSubmitted;

  /// Tipo de teclado.
  final TextInputType? keyboardType;

  /// Accion del teclado.
  final TextInputAction? textInputAction;

  /// Pistas de autorrelleno.
  final Iterable<String>? autofillHints;

  /// Oculta el texto (contrasenas).
  final bool obscureText;

  /// Si acepta entrada.
  final bool enabled;

  /// Solo lectura (seleccionable, no editable).
  final bool readOnly;

  /// Toma el foco al aparecer.
  final bool autofocus;

  /// Usa la fuente monoespaciada (ids, rutas, importes).
  final bool mono;

  /// Lineas maximas (1 = una linea).
  final int? maxLines;

  /// Lineas minimas.
  final int? minLines;

  /// Icono dentro del campo, a la izquierda.
  final IconData? prefixIcon;

  /// Widget dentro del campo, a la derecha (p. ej. un IconButton).
  final Widget? suffix;

  /// Decoracion extra; se mezcla con la que construye el widget.
  final InputDecoration? decoration;

  @override
  Widget build(BuildContext context) {
    final p = SwalPalette.of(context);
    final theme = Theme.of(context);
    final style = mono
        ? SwalTypography.of(context).mono
        : theme.textTheme.bodyMedium?.copyWith(color: p.text);

    final base = (decoration ?? const InputDecoration()).copyWith(
      hintText: hint,
      helperText: helper,
      errorText: errorText,
      prefixIcon: prefixIcon == null ? null : Icon(prefixIcon, size: 18),
      suffixIcon: suffix,
      fillColor: enabled ? null : Colors.transparent,
    );

    final field = controller != null || initialValue == null
        ? TextField(
            controller: controller,
            focusNode: focusNode,
            onChanged: onChanged,
            onSubmitted: onSubmitted,
            keyboardType: keyboardType,
            textInputAction: textInputAction,
            autofillHints: autofillHints,
            obscureText: obscureText,
            enabled: enabled,
            readOnly: readOnly,
            autofocus: autofocus,
            maxLines: obscureText ? 1 : maxLines,
            minLines: minLines,
            style: style,
            decoration: base,
          )
        : TextFormField(
            initialValue: initialValue,
            focusNode: focusNode,
            onChanged: onChanged,
            onFieldSubmitted: onSubmitted,
            keyboardType: keyboardType,
            textInputAction: textInputAction,
            autofillHints: autofillHints,
            obscureText: obscureText,
            enabled: enabled,
            readOnly: readOnly,
            autofocus: autofocus,
            maxLines: obscureText ? 1 : maxLines,
            minLines: minLines,
            style: style,
            decoration: base,
          );

    if (label == null) return field;
    // MergeSemantics: el lector de pantalla anuncia la etiqueta como nombre
    // del campo, igual que un <label for> en la web.
    return MergeSemantics(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: SwalTokens.space2),
            child: Text(
              label!,
              style: theme.textTheme.labelMedium?.copyWith(
                color: errorText != null ? p.danger : p.textSecondary,
              ),
            ),
          ),
          field,
        ],
      ),
    );
  }
}
