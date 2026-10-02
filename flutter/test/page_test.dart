import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:swal_ui/swal_ui.dart';

const _content = Key('content');

Future<Rect> _layout(
  WidgetTester tester,
  double width, {
  double maxWidth = 720,
}) async {
  tester.view.physicalSize = Size(width, 900);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(
    MaterialApp(
      theme: SwalTheme.light(),
      home: Scaffold(
        body: SwalPage(
          maxWidth: maxWidth,
          child: const SizedBox(key: _content, height: 200),
        ),
      ),
    ),
  );
  return tester.getRect(find.byKey(_content));
}

void main() {
  group('SwalBreakpoint', () {
    test('compact < 600 <= medium < 1024 <= expanded', () {
      expect(SwalBreakpoint.fromWidth(360), SwalBreakpoint.compact);
      expect(SwalBreakpoint.fromWidth(599.9), SwalBreakpoint.compact);
      expect(SwalBreakpoint.fromWidth(600), SwalBreakpoint.medium);
      expect(SwalBreakpoint.fromWidth(1023), SwalBreakpoint.medium);
      expect(SwalBreakpoint.fromWidth(1024), SwalBreakpoint.expanded);
    });
  });

  group('SwalPage', () {
    testWidgets('compact (400): ocupa el ancho menos 16 a cada lado', (
      tester,
    ) async {
      final r = await _layout(tester, 400);
      expect(r.left, 16);
      expect(r.width, 400 - 32);
      expect(r.top, SwalTokens.space6);
    });

    testWidgets('medium (800): limita a maxWidth y centra', (tester) async {
      final r = await _layout(tester, 800);
      // 800 - 2*24 = 752 disponibles > 720 de maximo.
      expect(r.width, 720);
      expect(r.left, (800 - 720) / 2);
      expect(r.center.dx, 400);
    });

    testWidgets('expanded (1600): ancho maximo por defecto centrado', (
      tester,
    ) async {
      final r = await _layout(tester, 1600, maxWidth: SwalTokens.pageMaxWidth);
      expect(r.width, SwalTokens.pageMaxWidth);
      expect(r.center.dx, 800);
      expect(r.left, (1600 - SwalTokens.pageMaxWidth) / 2);
    });

    testWidgets(
      'medium estrecho (640): el relleno de 24 manda sobre maxWidth',
      (tester) async {
        final r = await _layout(tester, 640);
        expect(r.left, 24);
        expect(r.width, 640 - 48);
      },
    );

    testWidgets('sin scroll, el hijo recibe el alto disponible', (
      tester,
    ) async {
      tester.view.physicalSize = const Size(400, 800);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      await tester.pumpWidget(
        MaterialApp(
          theme: SwalTheme.dark(),
          home: const Scaffold(
            body: SwalPage(
              scrollable: false,
              verticalPadding: 0,
              child: ColoredBox(key: _content, color: Color(0xFF000000)),
            ),
          ),
        ),
      );
      expect(tester.getSize(find.byKey(_content)), const Size(400 - 32, 800));
    });
  });

  group('SwalPage centerVertically', () {
    Future<Rect> pumpCentered(WidgetTester tester, double contentHeight) async {
      tester.view.physicalSize = const Size(560, 820);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      await tester.pumpWidget(
        MaterialApp(
          theme: SwalTheme.dark(),
          home: Scaffold(
            body: SwalPage(
              centerVertically: true,
              child: SizedBox(key: _content, height: contentHeight),
            ),
          ),
        ),
      );
      return tester.getRect(find.byKey(_content));
    }

    testWidgets('contenido corto queda centrado en vertical', (tester) async {
      final rect = await pumpCentered(tester, 200);
      expect(rect.center.dy, closeTo(410, 1));
    });

    testWidgets('contenido largo empieza arriba y hace scroll', (tester) async {
      final rect = await pumpCentered(tester, 2000);
      expect(rect.top, closeTo(SwalTokens.space6, 1));
      expect(find.byType(SingleChildScrollView), findsOneWidget);
    });
  });
}
