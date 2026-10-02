import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:swal_ui/swal_ui.dart';

Widget _app(Brightness mode, Widget child) => MaterialApp(
  theme: SwalTheme.of(mode),
  home: Scaffold(body: Center(child: child)),
);

/// Encuentra el boton Material por tipo, incluidas las subclases privadas
/// de los constructores `.icon`.
Finder _kind(Type type) => find.byWidgetPredicate(
  (w) => switch (type) {
    const (FilledButton) => w is FilledButton,
    const (OutlinedButton) => w is OutlinedButton,
    _ => w is TextButton,
  },
);

/// Color de fondo que el boton Material resuelve en reposo.
Color? _bg(WidgetTester tester, Type type) {
  final material = tester.widget<Material>(
    find.descendant(of: _kind(type), matching: find.byType(Material)).first,
  );
  return material.color;
}

void main() {
  for (final mode in [Brightness.light, Brightness.dark]) {
    final p = mode == Brightness.dark ? SwalPalette.dark : SwalPalette.light;

    group('SwalButton ${mode.name}', () {
      final cases = <(SwalButtonVariant, Type, Color)>[
        (SwalButtonVariant.primary, FilledButton, p.accent),
        (SwalButtonVariant.secondary, OutlinedButton, p.surface),
        (SwalButtonVariant.ghost, TextButton, Colors.transparent),
        (SwalButtonVariant.danger, FilledButton, p.danger),
      ];
      for (final (variant, type, bg) in cases) {
        testWidgets('${variant.name} se pinta y responde', (tester) async {
          var taps = 0;
          await tester.pumpWidget(
            _app(
              mode,
              SwalButton(
                label: 'Guardar',
                variant: variant,
                icon: Icons.check,
                onPressed: () => taps++,
              ),
            ),
          );
          expect(find.text('Guardar'), findsOneWidget);
          expect(_kind(type), findsOneWidget);
          expect(_bg(tester, type), bg);
          await tester.tap(find.byType(SwalButton));
          expect(taps, 1);
        });
      }

      testWidgets('el texto del primario usa on-accent', (tester) async {
        await tester.pumpWidget(
          _app(mode, SwalButton.primary(label: 'Pagar', onPressed: () {})),
        );
        final style = DefaultTextStyle.of(
          tester.element(find.text('Pagar')),
        ).style;
        expect(style.color, p.onAccent);
      });

      testWidgets('null o loading deshabilitan el boton', (tester) async {
        await tester.pumpWidget(
          _app(
            mode,
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SwalButton.secondary(label: 'Off', onPressed: null),
                SwalButton.primary(
                  label: 'Cargando',
                  loading: true,
                  onPressed: () {},
                ),
              ],
            ),
          ),
        );
        final buttons = tester.widgetList<ButtonStyleButton>(
          find.byWidgetPredicate((w) => w is ButtonStyleButton),
        );
        expect(buttons.every((b) => !b.enabled), isTrue);
        expect(find.byType(CircularProgressIndicator), findsOneWidget);
      });

      testWidgets('expand ocupa todo el ancho; small mide 36', (tester) async {
        await tester.pumpWidget(
          _app(
            mode,
            SizedBox(
              width: 300,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SwalButton.ghost(
                    key: const Key('wide'),
                    label: 'Ancho',
                    expand: true,
                    onPressed: () {},
                  ),
                  SwalButton.secondary(
                    key: const Key('small'),
                    label: 'Chico',
                    size: SwalButtonSize.small,
                    onPressed: () {},
                  ),
                ],
              ),
            ),
          ),
        );
        expect(tester.getSize(find.byKey(const Key('wide'))).width, 300);
        expect(tester.getSize(find.byType(OutlinedButton)).height, 36);
      });
    });
  }
}
