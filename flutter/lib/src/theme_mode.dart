import 'package:flutter/material.dart';

/// Modo de tema del usuario: claro, oscuro o el del sistema.
///
/// Los valores [storageValue] son los mismos que guarda la web en
/// `localStorage['swal:theme-mode']` (`@swal/ui/theme-mode`), asi una app
/// hibrida comparte la preferencia sin traducirla.
enum SwalThemeMode {
  /// Papel Alabastro.
  light,

  /// Carbon Mineral.
  dark,

  /// Sigue al sistema operativo.
  system;

  /// Clave de almacenamiento compartida con la web.
  static const String storageKey = 'swal:theme-mode';

  /// Lee un valor guardado; cualquier cosa desconocida cae a [fallback].
  static SwalThemeMode parse(String? value, {SwalThemeMode fallback = system}) {
    for (final mode in values) {
      if (mode.name == value) return mode;
    }
    return fallback;
  }

  /// Valor para guardar (`light` | `dark` | `system`).
  String get storageValue => name;

  /// El `ThemeMode` de Material para `MaterialApp.themeMode`.
  ThemeMode get themeMode => switch (this) {
    light => ThemeMode.light,
    dark => ThemeMode.dark,
    system => ThemeMode.system,
  };

  /// Brillo efectivo dado el brillo de la plataforma.
  Brightness resolve(Brightness platformBrightness) => switch (this) {
    light => Brightness.light,
    dark => Brightness.dark,
    system => platformBrightness,
  };

  /// Siguiente modo en el ciclo claro → oscuro → sistema (boton de alternar).
  SwalThemeMode get next => values[(index + 1) % values.length];

  /// Icono que representa el modo.
  IconData get icon => switch (this) {
    light => Icons.light_mode_outlined,
    dark => Icons.dark_mode_outlined,
    system => Icons.brightness_auto_outlined,
  };
}
