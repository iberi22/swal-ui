import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:swal_ui_example/main.dart';

void main() {
  for (final size in [const Size(400, 900), const Size(1280, 900)]) {
    testWidgets('la galeria se pinta a ${size.width.toInt()} px', (
      tester,
    ) async {
      tester.view.physicalSize = size;
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);
      await tester.pumpWidget(const GalleryApp());
      expect(find.text('Botones'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  }
}
