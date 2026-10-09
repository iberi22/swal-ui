import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:swal_ui/swal_ui.dart';

void main() {
  group('tokens generados', () {
    test('escala de espacio 4/8/12/16/24/32/48', () {
      expect(SwalTokens.spacing, <double>[4, 8, 12, 16, 24, 32, 48]);
    });

    test('radios y tiempos de theme.css', () {
      expect(SwalTokens.radius, 12);
      expect(SwalTokens.radiusLg, 16);
      expect(SwalTokens.durationFast, const Duration(milliseconds: 120));
    });

    test('canvas Bone: Papel Alabastro / Carbon Mineral', () {
      expect(SwalPalette.light.bg, const Color(0xFFFAF9F5));
      expect(SwalPalette.dark.bg, const Color(0xFF121211));
    });
  });

  group('SwalThemeMode', () {
    test('lee los valores de la web y cae al fallback', () {
      expect(SwalThemeMode.parse('dark'), SwalThemeMode.dark);
      expect(SwalThemeMode.parse('light'), SwalThemeMode.light);
      expect(SwalThemeMode.parse('nope'), SwalThemeMode.system);
      expect(
        SwalThemeMode.parse(null, fallback: SwalThemeMode.light),
        SwalThemeMode.light,
      );
      expect(SwalThemeMode.storageKey, 'swal:theme-mode');
    });

    test('ThemeMode, resolve y ciclo', () {
      expect(SwalThemeMode.system.themeMode, ThemeMode.system);
      expect(SwalThemeMode.system.resolve(Brightness.dark), Brightness.dark);
      expect(SwalThemeMode.light.resolve(Brightness.dark), Brightness.light);
      expect(SwalThemeMode.light.next, SwalThemeMode.dark);
      expect(SwalThemeMode.system.next, SwalThemeMode.light);
    });
  });

  test('AppBar plana: canvas, sin tinte ni sombra', () {
    for (final t in [SwalTheme.light(), SwalTheme.dark()]) {
      expect(t.appBarTheme.backgroundColor, t.scaffoldBackgroundColor);
      expect(t.appBarTheme.scrolledUnderElevation, 0);
      expect(t.appBarTheme.surfaceTintColor, Colors.transparent);
    }
  });

  test('bundledFonts usa Inter del paquete; sin el, la del sistema', () {
    expect(
      SwalTheme.light().textTheme.bodyMedium!.fontFamily,
      'packages/swal_ui/Inter',
    );
    expect(
      SwalTheme.light(bundledFonts: false).textTheme.bodyMedium!.fontFamily,
      isNot(contains('swal_ui')),
    );
  });

  for (final mode in [Brightness.light, Brightness.dark]) {
    testWidgets('todos los widgets se pintan en ${mode.name}', (tester) async {
      tester.view.physicalSize = const Size(1200, 2400);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      await tester.pumpWidget(
        MaterialApp(
          theme: SwalTheme.of(mode),
          home: Scaffold(
            appBar: AppBar(title: const SwalBrandMark(product: 'Fize')),
            body: SwalPage(
              child: Column(
                children: [
                  const SwalSectionHeader(
                    kicker: 'Facturacion',
                    title: 'Facturas',
                    subtitle: 'Ultimos 30 dias',
                  ),
                  SwalCard(
                    blur: true,
                    onTap: () {},
                    child: const Text('Tarjeta'),
                  ),
                  const SwalTextField(label: 'Nombre', hint: 'Ada', mono: true),
                  const SwalTextField(label: 'Correo', errorText: 'Invalido'),
                  const Wrap(
                    children: [
                      SwalStatusBadge(
                        label: 'Pagado',
                        status: SwalStatus.success,
                      ),
                      SwalStatusBadge(
                        label: 'Pendiente',
                        status: SwalStatus.warning,
                      ),
                      SwalStatusBadge(
                        label: 'Vencido',
                        status: SwalStatus.danger,
                      ),
                      SwalStatusBadge(label: 'Nuevo', status: SwalStatus.info),
                      SwalStatusBadge(label: 'Borrador'),
                    ],
                  ),
                  const SizedBox(
                    height: 300,
                    child: SwalEmptyState(
                      title: 'Sin facturas',
                      message: 'Crea la primera.',
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
      expect(tester.takeException(), isNull);
      expect(find.text('SWAL'), findsOneWidget);
      expect(find.text('FACTURACION'), findsOneWidget);
      expect(find.text('Invalido'), findsOneWidget);
      expect(find.text('Pagado'), findsOneWidget);
      expect(find.text('Sin facturas'), findsOneWidget);
      expect(find.bySemanticsLabel('SWAL Fize'), findsOneWidget);
    });
  }

  testWidgets('SwalTextField: escribir llama onChanged', (tester) async {
    String? value;
    await tester.pumpWidget(
      MaterialApp(
        theme: SwalTheme.light(),
        home: Scaffold(
          body: SwalTextField(label: 'Nombre', onChanged: (v) => value = v),
        ),
      ),
    );
    await tester.enterText(find.byType(TextField), 'Bone');
    expect(value, 'Bone');
  });
}
