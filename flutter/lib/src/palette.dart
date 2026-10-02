import 'package:flutter/material.dart';

import 'tokens.g.dart';

/// Paleta completa de un modo del tema "Bone Taller".
///
/// Cada campo es un token `--swal-*` de la web con el mismo nombre en
/// camelCase (`--swal-text-muted` → [textMuted]). Los valores salen de
/// `tokens.g.dart`, generado desde el CSS: no se escriben a mano.
///
/// Varios colores son translucidos a proposito (jerarquia por OPACIDAD del
/// mismo tono, glass al 85-90%). Para un color opaco sobre el canvas usa
/// [over].
///
/// Se instala en el tema como `ThemeExtension`, asi que desde un widget:
/// `SwalPalette.of(context).accent`.
@immutable
class SwalPalette extends ThemeExtension<SwalPalette> {
  /// Crea una paleta. Normalmente se usa [light] o [dark].
  const SwalPalette({
    required this.brightness,
    required this.bg,
    required this.surface,
    required this.surfaceHover,
    required this.surfaceActive,
    required this.elevated,
    required this.overlay,
    required this.voidColor,
    required this.border,
    required this.borderLight,
    required this.borderStrong,
    required this.text,
    required this.textSecondary,
    required this.textMuted,
    required this.textFaint,
    required this.textInverse,
    required this.hover,
    required this.accent,
    required this.accentHover,
    required this.accentMuted,
    required this.accentText,
    required this.onAccent,
    required this.focusRing,
    required this.selection,
    required this.success,
    required this.warning,
    required this.danger,
    required this.info,
    required this.successMuted,
    required this.warningMuted,
    required this.dangerMuted,
    required this.infoMuted,
    required this.onDanger,
    required this.shadowSm,
    required this.shadow,
    required this.shadowLg,
  });

  /// Papel Alabastro + naranja Taller.
  static const SwalPalette light = swalPaletteLight;

  /// Carbon Mineral + naranja Taller.
  static const SwalPalette dark = swalPaletteDark;

  /// Paleta del tema actual; si el tema no la trae, la del brillo actual.
  static SwalPalette of(BuildContext context) {
    final theme = Theme.of(context);
    return theme.extension<SwalPalette>() ??
        (theme.brightness == Brightness.dark ? dark : light);
  }

  /// Modo al que pertenece la paleta.
  final Brightness brightness;

  /// `--swal-bg`: canvas de la app.
  final Color bg;

  /// `--swal-surface`: tarjeta / panel de vidrio (translucido).
  final Color surface;

  /// `--swal-surface-hover`: superficie bajo el puntero.
  final Color surfaceHover;

  /// `--swal-surface-active`: superficie pulsada o seleccionada.
  final Color surfaceActive;

  /// `--swal-elevated`: dialogo, menu, hoja.
  final Color elevated;

  /// `--swal-overlay`: velo detras de un modal.
  final Color overlay;

  /// `--swal-void`: fondo de terminal / pozo.
  final Color voidColor;

  /// `--swal-border`: borde de 1px de tarjetas y separadores.
  final Color border;

  /// `--swal-border-light`: borde de inputs y botones secundarios.
  final Color borderLight;

  /// `--swal-border-strong`: borde que tiene que verse (scrollbar, outline).
  final Color borderStrong;

  /// `--swal-text`: texto principal.
  final Color text;

  /// `--swal-text-secondary`: subtitulos, etiquetas.
  final Color textSecondary;

  /// `--swal-text-muted`: metadatos, placeholders (AA).
  final Color textMuted;

  /// `--swal-text-faint`: solo decorativo / texto grande (no AA).
  final Color textFaint;

  /// `--swal-text-inverse`: texto sobre un relleno de [text].
  final Color textInverse;

  /// `--swal-hover`: velo neutro de hover.
  final Color hover;

  /// `--swal-accent`: naranja de relleno (accion primaria, seleccion).
  final Color accent;

  /// `--swal-accent-hover`: relleno naranja bajo el puntero.
  final Color accentHover;

  /// `--swal-accent-muted`: fondo de navegacion activa / seleccion suave.
  final Color accentMuted;

  /// `--swal-accent-text`: naranja legible como TEXTO o icono.
  final Color accentText;

  /// `--swal-on-accent`: texto sobre [accent].
  final Color onAccent;

  /// `--swal-focus-ring`: anillo de foco (>= 3:1 sobre el canvas).
  final Color focusRing;

  /// `--swal-selection`: seleccion de texto.
  final Color selection;

  /// `--swal-success`: estado correcto.
  final Color success;

  /// `--swal-warning`: aviso.
  final Color warning;

  /// `--swal-danger`: error / accion destructiva.
  final Color danger;

  /// `--swal-info`: informacion.
  final Color info;

  /// `--swal-success-muted`: fondo de [success].
  final Color successMuted;

  /// `--swal-warning-muted`: fondo de [warning].
  final Color warningMuted;

  /// `--swal-danger-muted`: fondo de [danger].
  final Color dangerMuted;

  /// `--swal-info-muted`: fondo de [info].
  final Color infoMuted;

  /// `--swal-on-danger`: texto sobre [danger].
  final Color onDanger;

  /// `--swal-shadow-sm`: sombra de chips y botones.
  final List<BoxShadow> shadowSm;

  /// `--swal-shadow`: sombra difusa de tarjeta.
  final List<BoxShadow> shadow;

  /// `--swal-shadow-lg`: sombra de dialogo / popover.
  final List<BoxShadow> shadowLg;

  /// Si la paleta es la oscura.
  bool get isDark => brightness == Brightness.dark;

  /// [color] compuesto sobre [base] (por defecto el canvas [bg]): el color
  /// opaco que el ojo ve. Lo usan los roles de Material que esperan opacos.
  Color over(Color color, [Color? base]) => Color.alphaBlend(
    color,
    Color.alphaBlend(base ?? bg, const Color(0xFF000000)),
  );

  @override
  SwalPalette copyWith({
    Brightness? brightness,
    Color? bg,
    Color? surface,
    Color? surfaceHover,
    Color? surfaceActive,
    Color? elevated,
    Color? overlay,
    Color? voidColor,
    Color? border,
    Color? borderLight,
    Color? borderStrong,
    Color? text,
    Color? textSecondary,
    Color? textMuted,
    Color? textFaint,
    Color? textInverse,
    Color? hover,
    Color? accent,
    Color? accentHover,
    Color? accentMuted,
    Color? accentText,
    Color? onAccent,
    Color? focusRing,
    Color? selection,
    Color? success,
    Color? warning,
    Color? danger,
    Color? info,
    Color? successMuted,
    Color? warningMuted,
    Color? dangerMuted,
    Color? infoMuted,
    Color? onDanger,
    List<BoxShadow>? shadowSm,
    List<BoxShadow>? shadow,
    List<BoxShadow>? shadowLg,
  }) {
    return SwalPalette(
      brightness: brightness ?? this.brightness,
      bg: bg ?? this.bg,
      surface: surface ?? this.surface,
      surfaceHover: surfaceHover ?? this.surfaceHover,
      surfaceActive: surfaceActive ?? this.surfaceActive,
      elevated: elevated ?? this.elevated,
      overlay: overlay ?? this.overlay,
      voidColor: voidColor ?? this.voidColor,
      border: border ?? this.border,
      borderLight: borderLight ?? this.borderLight,
      borderStrong: borderStrong ?? this.borderStrong,
      text: text ?? this.text,
      textSecondary: textSecondary ?? this.textSecondary,
      textMuted: textMuted ?? this.textMuted,
      textFaint: textFaint ?? this.textFaint,
      textInverse: textInverse ?? this.textInverse,
      hover: hover ?? this.hover,
      accent: accent ?? this.accent,
      accentHover: accentHover ?? this.accentHover,
      accentMuted: accentMuted ?? this.accentMuted,
      accentText: accentText ?? this.accentText,
      onAccent: onAccent ?? this.onAccent,
      focusRing: focusRing ?? this.focusRing,
      selection: selection ?? this.selection,
      success: success ?? this.success,
      warning: warning ?? this.warning,
      danger: danger ?? this.danger,
      info: info ?? this.info,
      successMuted: successMuted ?? this.successMuted,
      warningMuted: warningMuted ?? this.warningMuted,
      dangerMuted: dangerMuted ?? this.dangerMuted,
      infoMuted: infoMuted ?? this.infoMuted,
      onDanger: onDanger ?? this.onDanger,
      shadowSm: shadowSm ?? this.shadowSm,
      shadow: shadow ?? this.shadow,
      shadowLg: shadowLg ?? this.shadowLg,
    );
  }

  @override
  SwalPalette lerp(covariant ThemeExtension<SwalPalette>? other, double t) {
    if (other is! SwalPalette) return this;
    Color c(Color a, Color b) => Color.lerp(a, b, t)!;
    List<BoxShadow> s(List<BoxShadow> a, List<BoxShadow> b) =>
        BoxShadow.lerpList(a, b, t) ?? b;
    return SwalPalette(
      brightness: t < 0.5 ? brightness : other.brightness,
      bg: c(bg, other.bg),
      surface: c(surface, other.surface),
      surfaceHover: c(surfaceHover, other.surfaceHover),
      surfaceActive: c(surfaceActive, other.surfaceActive),
      elevated: c(elevated, other.elevated),
      overlay: c(overlay, other.overlay),
      voidColor: c(voidColor, other.voidColor),
      border: c(border, other.border),
      borderLight: c(borderLight, other.borderLight),
      borderStrong: c(borderStrong, other.borderStrong),
      text: c(text, other.text),
      textSecondary: c(textSecondary, other.textSecondary),
      textMuted: c(textMuted, other.textMuted),
      textFaint: c(textFaint, other.textFaint),
      textInverse: c(textInverse, other.textInverse),
      hover: c(hover, other.hover),
      accent: c(accent, other.accent),
      accentHover: c(accentHover, other.accentHover),
      accentMuted: c(accentMuted, other.accentMuted),
      accentText: c(accentText, other.accentText),
      onAccent: c(onAccent, other.onAccent),
      focusRing: c(focusRing, other.focusRing),
      selection: c(selection, other.selection),
      success: c(success, other.success),
      warning: c(warning, other.warning),
      danger: c(danger, other.danger),
      info: c(info, other.info),
      successMuted: c(successMuted, other.successMuted),
      warningMuted: c(warningMuted, other.warningMuted),
      dangerMuted: c(dangerMuted, other.dangerMuted),
      infoMuted: c(infoMuted, other.infoMuted),
      onDanger: c(onDanger, other.onDanger),
      shadowSm: s(shadowSm, other.shadowSm),
      shadow: s(shadow, other.shadow),
      shadowLg: s(shadowLg, other.shadowLg),
    );
  }
}
