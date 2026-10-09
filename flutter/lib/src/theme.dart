import 'package:flutter/material.dart';

import 'palette.dart';
import 'tokens.dart';
import 'typography.dart';

/// Tema "Bone Taller" para Material 3.
///
/// Bone: un solo tono de piedra / alabastro, jerarquia por opacidad, glass
/// tactil (superficies al 85-90 %, borde de 1px, sombra difusa). Taller: el
/// naranja #FF6A13 como UNICO acento — accion primaria, anillo de foco,
/// seleccion y navegacion activa. Todo lo demas es piedra; los unicos otros
/// colores son semanticos (exito / aviso / error / info).
///
/// ```dart
/// MaterialApp(
///   theme: SwalTheme.light(),
///   darkTheme: SwalTheme.dark(),
///   themeMode: SwalThemeMode.system.themeMode,
/// );
/// ```
abstract final class SwalTheme {
  /// Papel Alabastro + naranja. Con [bundledFonts] en `false` usa las
  /// fuentes del sistema en vez de Inter / JetBrains Mono del paquete.
  static ThemeData light({bool bundledFonts = true}) =>
      fromPalette(SwalPalette.light, bundledFonts: bundledFonts);

  /// Carbon Mineral + naranja.
  static ThemeData dark({bool bundledFonts = true}) =>
      fromPalette(SwalPalette.dark, bundledFonts: bundledFonts);

  /// Tema para un brillo concreto.
  static ThemeData of(Brightness brightness, {bool bundledFonts = true}) =>
      brightness == Brightness.dark
      ? dark(bundledFonts: bundledFonts)
      : light(bundledFonts: bundledFonts);

  /// `ColorScheme` de Material derivado de la paleta. Los roles que Material
  /// espera opacos se componen sobre el canvas.
  static ColorScheme colorScheme(SwalPalette p) {
    return ColorScheme(
      brightness: p.brightness,
      primary: p.accent,
      onPrimary: p.onAccent,
      primaryContainer: p.over(p.accentMuted),
      onPrimaryContainer: p.accentText,
      primaryFixed: p.accent,
      onPrimaryFixed: p.onAccent,
      inversePrimary: p.accent,
      // Secundario = piedra: botones secundarios, chips, superficies tonales.
      secondary: p.text,
      onSecondary: p.textInverse,
      secondaryContainer: p.over(p.accentMuted),
      onSecondaryContainer: p.accentText,
      tertiary: p.info,
      onTertiary: p.bg,
      tertiaryContainer: p.over(p.infoMuted),
      onTertiaryContainer: p.info,
      error: p.danger,
      onError: p.onDanger,
      errorContainer: p.over(p.dangerMuted),
      onErrorContainer: p.danger,
      surface: p.bg,
      onSurface: p.text,
      onSurfaceVariant: p.over(p.textSecondary),
      surfaceDim: p.over(p.surfaceActive),
      surfaceBright: p.over(p.elevated),
      surfaceContainerLowest: p.bg,
      surfaceContainerLow: p.over(p.surface),
      surfaceContainer: p.over(p.surface),
      surfaceContainerHigh: p.over(p.surfaceHover),
      surfaceContainerHighest: p.over(p.surfaceActive),
      outline: p.over(p.borderStrong),
      outlineVariant: p.over(p.border),
      shadow: const Color(0xFF000000),
      scrim: p.overlay,
      inverseSurface: p.text,
      onInverseSurface: p.textInverse,
      surfaceTint: Colors.transparent,
    );
  }

  /// Tema completo para cualquier [SwalPalette] (p. ej. una paleta derivada
  /// con `copyWith`).
  static ThemeData fromPalette(SwalPalette p, {bool bundledFonts = true}) {
    final scheme = colorScheme(p);
    final base = ThemeData(
      useMaterial3: true,
      brightness: p.brightness,
      colorScheme: scheme,
      fontFamily: bundledFonts ? SwalTypography.sansFamily : null,
      fontFamilyFallback: SwalTypography.sansFallback,
      textTheme: swalTextTheme(p),
    );
    final text = base.textTheme;
    final c = _Components(p, text);

    return base.copyWith(
      scaffoldBackgroundColor: p.bg,
      canvasColor: p.bg,
      cardColor: p.over(p.surface),
      dividerColor: p.border,
      disabledColor: p.textFaint,
      hoverColor: p.hover,
      focusColor: p.accentMuted,
      highlightColor: Colors.transparent,
      splashColor: p.hover,
      splashFactory: InkRipple.splashFactory,
      visualDensity: VisualDensity.standard,
      iconTheme: IconThemeData(color: p.textSecondary, size: 20),
      extensions: <ThemeExtension<dynamic>>[
        p,
        SwalTypography.forPalette(p, bundledFonts: bundledFonts),
      ],
      appBarTheme: AppBarTheme(
        // Plana: mismo canvas que la pagina, sin barra de color ni tinte al
        // hacer scroll. Solo un borde de 1px la separa del contenido.
        backgroundColor: p.bg,
        foregroundColor: p.text,
        surfaceTintColor: Colors.transparent,
        shadowColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleSpacing: SwalTokens.space4,
        titleTextStyle: text.titleLarge,
        iconTheme: IconThemeData(color: p.textSecondary, size: 20),
        actionsIconTheme: IconThemeData(color: p.textSecondary, size: 20),
        shape: Border(bottom: BorderSide(color: p.border)),
      ),
      filledButtonTheme: FilledButtonThemeData(style: c.primaryButton),
      elevatedButtonTheme: ElevatedButtonThemeData(style: c.secondaryButton),
      outlinedButtonTheme: OutlinedButtonThemeData(style: c.secondaryButton),
      textButtonTheme: TextButtonThemeData(style: c.ghostButton),
      iconButtonTheme: IconButtonThemeData(style: c.iconButton),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: p.accent,
        foregroundColor: p.onAccent,
        hoverColor: p.accentHover,
        focusColor: p.accentHover,
        splashColor: p.onAccent.withValues(alpha: 0.1),
        elevation: 0,
        focusElevation: 0,
        hoverElevation: 0,
        highlightElevation: 0,
        shape: c.rounded(SwalTokens.radiusLg),
      ),
      segmentedButtonTheme: SegmentedButtonThemeData(style: c.segmented),
      inputDecorationTheme: c.input,
      textSelectionTheme: TextSelectionThemeData(
        cursorColor: p.focusRing,
        selectionColor: p.selection,
        selectionHandleColor: p.accent,
      ),
      cardTheme: CardThemeData(
        color: p.surface,
        surfaceTintColor: Colors.transparent,
        shadowColor: Colors.transparent,
        elevation: 0,
        margin: EdgeInsets.zero,
        clipBehavior: Clip.antiAlias,
        shape: c.rounded(
          SwalTokens.radiusLg,
          side: BorderSide(color: p.border),
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: p.over(p.elevated),
        surfaceTintColor: Colors.transparent,
        shadowColor: p.shadowLg.first.color,
        elevation: 8,
        barrierColor: p.overlay,
        shape: c.rounded(
          SwalTokens.radiusXl,
          side: BorderSide(color: p.border),
        ),
        titleTextStyle: text.titleLarge,
        contentTextStyle: text.bodyMedium?.copyWith(color: p.textSecondary),
        iconColor: p.textSecondary,
      ),
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: p.over(p.elevated),
        modalBackgroundColor: p.over(p.elevated),
        surfaceTintColor: Colors.transparent,
        modalBarrierColor: p.overlay,
        elevation: 0,
        modalElevation: 0,
        dragHandleColor: p.borderStrong,
        shape: RoundedRectangleBorder(
          side: BorderSide(color: p.border),
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(SwalTokens.radiusXl),
          ),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        // Una tarjeta mas, no una barra negra: piedra elevada con borde.
        backgroundColor: p.over(p.elevated),
        contentTextStyle: text.bodyMedium,
        actionTextColor: p.accentText,
        closeIconColor: p.textSecondary,
        behavior: SnackBarBehavior.floating,
        elevation: 4,
        shape: c.rounded(
          SwalTokens.radius,
          side: BorderSide(color: p.borderLight),
        ),
      ),
      dividerTheme: DividerThemeData(color: p.border, thickness: 1, space: 1),
      chipTheme: ChipThemeData(
        backgroundColor: p.over(p.surface),
        selectedColor: p.over(p.accentMuted),
        disabledColor: p.over(p.surfaceActive),
        checkmarkColor: p.accentText,
        deleteIconColor: p.textMuted,
        labelStyle: text.labelMedium,
        secondaryLabelStyle: text.labelMedium?.copyWith(color: p.accentText),
        side: BorderSide(color: p.borderLight),
        shape: c.rounded(SwalTokens.radiusXs),
        padding: const EdgeInsets.symmetric(
          horizontal: SwalTokens.space2,
          vertical: SwalTokens.space1,
        ),
        elevation: 0,
        pressElevation: 0,
        surfaceTintColor: Colors.transparent,
        showCheckmark: true,
      ),
      listTileTheme: ListTileThemeData(
        iconColor: p.textSecondary,
        textColor: p.text,
        selectedColor: p.accentText,
        selectedTileColor: p.accentMuted,
        titleTextStyle: text.bodyLarge,
        subtitleTextStyle: text.bodySmall,
        leadingAndTrailingTextStyle: text.labelMedium,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: SwalTokens.space3,
        ),
        minVerticalPadding: SwalTokens.space2,
        shape: c.rounded(SwalTokens.radiusSm),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: p.over(p.surface),
        surfaceTintColor: Colors.transparent,
        shadowColor: Colors.transparent,
        elevation: 0,
        height: 64,
        indicatorColor: p.over(p.accentMuted),
        indicatorShape: c.rounded(SwalTokens.radiusFull),
        iconTheme: WidgetStateProperty.resolveWith(
          (s) => IconThemeData(
            size: 22,
            color: s.contains(WidgetState.selected)
                ? p.accentText
                : p.textMuted,
          ),
        ),
        labelTextStyle: WidgetStateProperty.resolveWith(
          (s) => text.labelSmall?.copyWith(
            color: s.contains(WidgetState.selected)
                ? p.accentText
                : p.textMuted,
            fontWeight: s.contains(WidgetState.selected)
                ? FontWeight.w600
                : FontWeight.w500,
          ),
        ),
      ),
      navigationRailTheme: NavigationRailThemeData(
        backgroundColor: p.bg,
        elevation: 0,
        useIndicator: true,
        indicatorColor: p.over(p.accentMuted),
        indicatorShape: c.rounded(SwalTokens.radius),
        selectedIconTheme: IconThemeData(color: p.accentText, size: 22),
        unselectedIconTheme: IconThemeData(color: p.textMuted, size: 22),
        selectedLabelTextStyle: text.labelMedium?.copyWith(
          color: p.accentText,
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelTextStyle: text.labelMedium?.copyWith(
          color: p.textMuted,
        ),
      ),
      navigationDrawerTheme: NavigationDrawerThemeData(
        backgroundColor: p.bg,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        indicatorColor: p.over(p.accentMuted),
        indicatorShape: c.rounded(SwalTokens.radius),
      ),
      drawerTheme: DrawerThemeData(
        backgroundColor: p.bg,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        shape: const RoundedRectangleBorder(),
      ),
      tabBarTheme: TabBarThemeData(
        labelColor: p.text,
        unselectedLabelColor: p.textMuted,
        indicatorColor: p.accent,
        dividerColor: p.border,
        labelStyle: text.labelLarge?.copyWith(fontWeight: FontWeight.w600),
        unselectedLabelStyle: text.labelLarge,
        overlayColor: WidgetStatePropertyAll(p.hover),
      ),
      checkboxTheme: CheckboxThemeData(
        fillColor: WidgetStateProperty.resolveWith(
          (s) =>
              s.contains(WidgetState.selected) ? p.accent : Colors.transparent,
        ),
        checkColor: WidgetStatePropertyAll(p.onAccent),
        side: BorderSide(color: p.borderStrong, width: 1.5),
        shape: c.rounded(SwalTokens.radiusXs / 1.5),
      ),
      radioTheme: RadioThemeData(
        fillColor: WidgetStateProperty.resolveWith(
          (s) => s.contains(WidgetState.selected) ? p.accent : p.borderStrong,
        ),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith(
          (s) => s.contains(WidgetState.selected)
              ? p.onAccent
              : p.over(p.borderStrong),
        ),
        trackColor: WidgetStateProperty.resolveWith(
          (s) => s.contains(WidgetState.selected)
              ? p.accent
              : p.over(p.surfaceActive),
        ),
        trackOutlineColor: WidgetStateProperty.resolveWith(
          (s) => s.contains(WidgetState.selected) ? p.accent : p.borderLight,
        ),
      ),
      progressIndicatorTheme: ProgressIndicatorThemeData(
        color: p.accent,
        linearTrackColor: p.over(p.border),
        circularTrackColor: Colors.transparent,
      ),
      sliderTheme: SliderThemeData(
        activeTrackColor: p.accent,
        inactiveTrackColor: p.over(p.border),
        thumbColor: p.accent,
        overlayColor: p.accentMuted,
      ),
      tooltipTheme: TooltipThemeData(
        decoration: BoxDecoration(
          color: p.text,
          borderRadius: BorderRadius.circular(SwalTokens.radiusSm),
        ),
        textStyle: text.labelMedium?.copyWith(color: p.textInverse),
      ),
      popupMenuTheme: PopupMenuThemeData(
        color: p.over(p.elevated),
        surfaceTintColor: Colors.transparent,
        elevation: 6,
        shadowColor: p.shadowLg.first.color,
        textStyle: text.bodyMedium,
        shape: c.rounded(SwalTokens.radius, side: BorderSide(color: p.border)),
      ),
      scrollbarTheme: ScrollbarThemeData(
        thumbColor: WidgetStatePropertyAll(p.borderStrong),
        radius: const Radius.circular(4),
        thickness: const WidgetStatePropertyAll(6),
      ),
      badgeTheme: BadgeThemeData(
        backgroundColor: p.accent,
        textColor: p.onAccent,
      ),
    );
  }
}

/// Estilos de componente compartidos por [SwalTheme] y los widgets Swal.
class _Components {
  _Components(this.p, this.text);

  final SwalPalette p;
  final TextTheme text;

  RoundedRectangleBorder rounded(
    double radius, {
    BorderSide side = BorderSide.none,
  }) => RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(radius),
    side: side,
  );

  /// Anillo de foco: 2px de --swal-focus-ring cuando el control tiene foco
  /// de teclado; si no, [rest].
  WidgetStateProperty<BorderSide?> focusSide([
    BorderSide rest = BorderSide.none,
  ]) => WidgetStateProperty.resolveWith(
    (s) => s.contains(WidgetState.focused)
        ? BorderSide(color: p.focusRing, width: 2)
        : rest,
  );

  ButtonStyle _base() => ButtonStyle(
    elevation: const WidgetStatePropertyAll(0),
    shadowColor: const WidgetStatePropertyAll(Colors.transparent),
    surfaceTintColor: const WidgetStatePropertyAll(Colors.transparent),
    padding: const WidgetStatePropertyAll(
      EdgeInsets.symmetric(
        horizontal: SwalTokens.space4,
        vertical: SwalTokens.space3,
      ),
    ),
    minimumSize: const WidgetStatePropertyAll(
      Size(64, SwalTokens.minTapTarget),
    ),
    shape: WidgetStatePropertyAll(rounded(SwalTokens.radius)),
    textStyle: WidgetStatePropertyAll(
      text.labelLarge?.copyWith(fontWeight: FontWeight.w600),
    ),
    iconSize: const WidgetStatePropertyAll(18),
    animationDuration: SwalTokens.durationFast,
  );

  /// Naranja: la UNICA accion que destaca en pantalla.
  ButtonStyle get primaryButton => _base().copyWith(
    backgroundColor: WidgetStateProperty.resolveWith((s) {
      if (s.contains(WidgetState.disabled)) return p.over(p.surfaceActive);
      if (s.contains(WidgetState.hovered) ||
          s.contains(WidgetState.pressed) ||
          s.contains(WidgetState.focused)) {
        return p.accentHover;
      }
      return p.accent;
    }),
    foregroundColor: WidgetStateProperty.resolveWith(
      (s) => s.contains(WidgetState.disabled) ? p.textFaint : p.onAccent,
    ),
    iconColor: WidgetStateProperty.resolveWith(
      (s) => s.contains(WidgetState.disabled) ? p.textFaint : p.onAccent,
    ),
    overlayColor: WidgetStateProperty.resolveWith(
      (s) => s.contains(WidgetState.pressed)
          ? p.onAccent.withValues(alpha: 0.1)
          : Colors.transparent,
    ),
    // Un anillo naranja sobre un relleno naranja no se ve: el primario marca
    // el foco con un anillo interior del color de su texto (6:1 sobre naranja).
    side: WidgetStateProperty.resolveWith(
      (s) => s.contains(WidgetState.focused)
          ? BorderSide(color: p.onAccent, width: 2)
          : BorderSide.none,
    ),
  );

  /// Piedra: superficie de vidrio con borde de 1px.
  ButtonStyle get secondaryButton => _base().copyWith(
    backgroundColor: WidgetStateProperty.resolveWith((s) {
      if (s.contains(WidgetState.disabled)) return Colors.transparent;
      if (s.contains(WidgetState.pressed)) return p.surfaceActive;
      if (s.contains(WidgetState.hovered)) return p.surfaceHover;
      return p.surface;
    }),
    foregroundColor: WidgetStateProperty.resolveWith(
      (s) => s.contains(WidgetState.disabled) ? p.textFaint : p.text,
    ),
    iconColor: WidgetStateProperty.resolveWith(
      (s) => s.contains(WidgetState.disabled) ? p.textFaint : p.textSecondary,
    ),
    overlayColor: const WidgetStatePropertyAll(Colors.transparent),
    side: focusSide(BorderSide(color: p.borderLight)),
  );

  /// Sin fondo hasta el hover.
  ButtonStyle get ghostButton => _base().copyWith(
    backgroundColor: WidgetStateProperty.resolveWith((s) {
      if (s.contains(WidgetState.pressed)) return p.surfaceActive;
      if (s.contains(WidgetState.hovered)) return p.hover;
      return Colors.transparent;
    }),
    foregroundColor: WidgetStateProperty.resolveWith(
      (s) => s.contains(WidgetState.disabled) ? p.textFaint : p.text,
    ),
    iconColor: WidgetStateProperty.resolveWith(
      (s) => s.contains(WidgetState.disabled) ? p.textFaint : p.textSecondary,
    ),
    overlayColor: const WidgetStatePropertyAll(Colors.transparent),
    side: focusSide(),
    padding: const WidgetStatePropertyAll(
      EdgeInsets.symmetric(
        horizontal: SwalTokens.space3,
        vertical: SwalTokens.space3,
      ),
    ),
  );

  ButtonStyle get iconButton => ButtonStyle(
    foregroundColor: WidgetStateProperty.resolveWith((s) {
      if (s.contains(WidgetState.disabled)) return p.textFaint;
      if (s.contains(WidgetState.selected)) return p.accentText;
      return p.textSecondary;
    }),
    backgroundColor: WidgetStateProperty.resolveWith((s) {
      if (s.contains(WidgetState.selected)) return p.accentMuted;
      if (s.contains(WidgetState.pressed)) return p.surfaceActive;
      if (s.contains(WidgetState.hovered)) return p.hover;
      return Colors.transparent;
    }),
    overlayColor: const WidgetStatePropertyAll(Colors.transparent),
    shape: WidgetStatePropertyAll(rounded(SwalTokens.radius)),
    side: focusSide(),
  );

  ButtonStyle get segmented => ButtonStyle(
    backgroundColor: WidgetStateProperty.resolveWith(
      (s) => s.contains(WidgetState.selected) ? p.accentMuted : p.surface,
    ),
    foregroundColor: WidgetStateProperty.resolveWith(
      (s) => s.contains(WidgetState.selected) ? p.accentText : p.textSecondary,
    ),
    iconColor: WidgetStateProperty.resolveWith(
      (s) => s.contains(WidgetState.selected) ? p.accentText : p.textSecondary,
    ),
    overlayColor: WidgetStatePropertyAll(p.hover),
    side: focusSide(BorderSide(color: p.borderLight)),
    shape: WidgetStatePropertyAll(rounded(SwalTokens.radius)),
    textStyle: WidgetStatePropertyAll(text.labelMedium),
  );

  InputDecorationTheme get input {
    OutlineInputBorder border(Color color, [double width = 1]) =>
        OutlineInputBorder(
          borderRadius: BorderRadius.circular(SwalTokens.radius),
          borderSide: BorderSide(color: color, width: width),
        );
    return InputDecorationTheme(
      filled: true,
      fillColor: p.surface,
      hoverColor: Colors.transparent,
      isDense: true,
      contentPadding: const EdgeInsets.symmetric(
        horizontal: SwalTokens.space3,
        vertical: SwalTokens.space3,
      ),
      border: border(p.borderLight),
      enabledBorder: border(p.borderLight),
      disabledBorder: border(p.border),
      focusedBorder: border(p.focusRing, 2),
      errorBorder: border(p.danger),
      focusedErrorBorder: border(p.danger, 2),
      hintStyle: text.bodyMedium?.copyWith(color: p.textMuted),
      labelStyle: text.bodyMedium?.copyWith(color: p.textSecondary),
      floatingLabelStyle: text.labelMedium?.copyWith(color: p.accentText),
      helperStyle: text.bodySmall?.copyWith(color: p.textMuted),
      errorStyle: text.bodySmall?.copyWith(color: p.danger),
      prefixIconColor: p.textMuted,
      suffixIconColor: p.textMuted,
    );
  }
}
