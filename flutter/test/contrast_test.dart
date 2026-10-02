import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:swal_ui/swal_ui.dart';

/// Contraste WCAG 2.2 del tema, medido sobre los colores que REALMENTE pinta
/// Flutter (los del ThemeData instalado), no sobre literales del test.
void main() {
  for (final mode in [Brightness.light, Brightness.dark]) {
    group('contraste ${mode.name}', () {
      late ThemeData theme;
      late SwalPalette p;

      testWidgets('el tema instalado expone la paleta', (tester) async {
        await tester.pumpWidget(
          MaterialApp(
            theme: SwalTheme.of(mode),
            home: Builder(
              builder: (context) {
                theme = Theme.of(context);
                p = SwalPalette.of(context);
                return const SizedBox();
              },
            ),
          ),
        );
        expect(theme.brightness, mode);
        expect(p.brightness, mode);
        expect(
          p.accent,
          const Color(0xFFFF6A13),
          reason: 'acento = naranja Taller',
        );

        final cs = theme.colorScheme;
        final bg = theme.scaffoldBackgroundColor;
        final card = SwalContrast.composite(p.surface, bg);

        void aa(
          String what,
          Color fg,
          Color on, [
          double min = SwalContrast.aaText,
        ]) {
          final r = SwalContrast.ratio(fg, on);
          expect(
            r,
            greaterThanOrEqualTo(min),
            reason: '$what = ${r.toStringAsFixed(2)}:1',
          );
        }

        // Texto sobre el canvas y sobre la tarjeta de vidrio.
        for (final (name, on) in [('canvas', bg), ('tarjeta', card)]) {
          aa('texto / $name', theme.textTheme.bodyMedium!.color!, on);
          aa('secundario / $name', p.textSecondary, on);
          aa('muted / $name', p.textMuted, on);
          aa('acento-texto / $name', p.accentText, on);
          aa('exito / $name', p.success, on);
          aa('aviso / $name', p.warning, on);
          aa('peligro / $name', p.danger, on);
          aa('info / $name', p.info, on);
        }

        // Texto sobre rellenos solidos.
        aa('on-accent / accent', cs.onPrimary, cs.primary);
        aa('on-accent / accent-hover', p.onAccent, p.accentHover);
        aa('on-danger / danger', cs.onError, cs.error);
        aa('onSurface / surface', cs.onSurface, cs.surface);

        // No textual (WCAG 1.4.11): anillo de foco y cursor >= 3:1.
        aa('anillo de foco / canvas', p.focusRing, bg, SwalContrast.aaNonText);
        aa(
          'cursor / canvas',
          theme.textSelectionTheme.cursorColor!,
          bg,
          SwalContrast.aaNonText,
        );

        // Navegacion activa: icono/etiqueta sobre el indicador.
        aa(
          'nav activa',
          p.accentText,
          theme.navigationBarTheme.indicatorColor!,
        );
      });
    });
  }

  test('ratio coincide con los valores medidos en el CSS', () {
    // theme.css: texto #1C1917 sobre #FAF9F5 -> 16.60:1; bone-taller.css:
    // #1C1917 sobre #FF6A13 -> 6.10:1.
    expect(
      SwalContrast.ratio(const Color(0xFF1C1917), const Color(0xFFFAF9F5)),
      closeTo(16.60, 0.01),
    );
    expect(
      SwalContrast.ratio(const Color(0xFF1C1917), const Color(0xFFFF6A13)),
      closeTo(6.10, 0.01),
    );
  });

  test('el naranja de relleno NO sirve como texto sobre papel', () {
    // Por eso existe accentText: si alguien cambia el token, que lo sepa.
    expect(
      SwalContrast.ratio(SwalPalette.light.accent, SwalPalette.light.bg),
      lessThan(SwalContrast.aaNonText),
    );
  });
}
