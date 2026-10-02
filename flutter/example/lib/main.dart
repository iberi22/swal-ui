import 'package:flutter/material.dart';
import 'package:swal_ui/swal_ui.dart';

void main() => runApp(const GalleryApp());

/// Galeria del tema "Bone Taller": todos los widgets de swal_ui.
class GalleryApp extends StatefulWidget {
  const GalleryApp({super.key});

  @override
  State<GalleryApp> createState() => _GalleryAppState();
}

class _GalleryAppState extends State<GalleryApp> {
  SwalThemeMode _mode = SwalThemeMode.system;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'swal_ui',
      debugShowCheckedModeBanner: false,
      theme: SwalTheme.light(),
      darkTheme: SwalTheme.dark(),
      themeMode: _mode.themeMode,
      home: GalleryPage(mode: _mode, onMode: (m) => setState(() => _mode = m)),
    );
  }
}

class GalleryPage extends StatefulWidget {
  const GalleryPage({super.key, required this.mode, required this.onMode});

  final SwalThemeMode mode;
  final ValueChanged<SwalThemeMode> onMode;

  @override
  State<GalleryPage> createState() => _GalleryPageState();
}

class _GalleryPageState extends State<GalleryPage> {
  int _nav = 0;
  bool _loading = false;
  bool _selected = true;

  static const _destinations = [
    (Icons.dashboard_outlined, 'Inicio'),
    (Icons.receipt_long_outlined, 'Facturas'),
    (Icons.settings_outlined, 'Ajustes'),
  ];

  @override
  Widget build(BuildContext context) {
    final wide =
        SwalBreakpoint.fromWidth(MediaQuery.sizeOf(context).width) !=
        SwalBreakpoint.compact;

    final body = SwalPage(child: _content(context));

    return Scaffold(
      appBar: AppBar(
        title: const SwalBrandMark(product: 'Galeria'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: SwalTokens.space3),
            // Compacto: un boton que recorre los modos; ancho: los tres a la vista.
            child: wide
                ? SegmentedButton<SwalThemeMode>(
                    showSelectedIcon: false,
                    segments: [
                      for (final m in SwalThemeMode.values)
                        ButtonSegment(
                          value: m,
                          icon: Icon(m.icon, size: 18),
                          tooltip: m.name,
                        ),
                    ],
                    selected: {widget.mode},
                    onSelectionChanged: (s) => widget.onMode(s.first),
                  )
                : IconButton(
                    tooltip: 'Modo: ${widget.mode.name}',
                    icon: Icon(widget.mode.icon),
                    onPressed: () => widget.onMode(widget.mode.next),
                  ),
          ),
        ],
      ),
      body: wide
          ? Row(
              children: [
                NavigationRail(
                  selectedIndex: _nav,
                  onDestinationSelected: (i) => setState(() => _nav = i),
                  labelType: NavigationRailLabelType.all,
                  destinations: [
                    for (final (icon, label) in _destinations)
                      NavigationRailDestination(
                        icon: Icon(icon),
                        label: Text(label),
                      ),
                  ],
                ),
                const VerticalDivider(width: 1),
                Expanded(child: body),
              ],
            )
          : body,
      bottomNavigationBar: wide
          ? null
          : NavigationBar(
              selectedIndex: _nav,
              onDestinationSelected: (i) => setState(() => _nav = i),
              destinations: [
                for (final (icon, label) in _destinations)
                  NavigationDestination(icon: Icon(icon), label: label),
              ],
            ),
    );
  }

  Widget _content(BuildContext context) {
    const gap = SizedBox(height: SwalTokens.space8);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SwalSectionHeader(
          kicker: 'Bone Taller',
          title: 'Botones',
          subtitle: 'Un solo acento naranja: la accion principal.',
          trailing: SwalButton.ghost(
            label: 'Snackbar',
            icon: Icons.notifications_none,
            onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text('Factura guardada'),
                action: SnackBarAction(label: 'Deshacer', onPressed: () {}),
              ),
            ),
          ),
        ),
        Wrap(
          spacing: SwalTokens.space3,
          runSpacing: SwalTokens.space3,
          children: [
            SwalButton.primary(
              label: 'Pagar',
              icon: Icons.check,
              loading: _loading,
              onPressed: () async {
                setState(() => _loading = true);
                await Future<void>.delayed(const Duration(seconds: 1));
                if (mounted) setState(() => _loading = false);
              },
            ),
            SwalButton.secondary(label: 'Exportar', onPressed: () {}),
            SwalButton.ghost(label: 'Cancelar', onPressed: () {}),
            SwalButton.danger(
              label: 'Eliminar',
              icon: Icons.delete_outline,
              onPressed: () => showDialog<void>(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Eliminar factura'),
                  content: const Text('Esta accion no se puede deshacer.'),
                  actions: [
                    SwalButton.ghost(
                      label: 'Cancelar',
                      onPressed: () => Navigator.pop(context),
                    ),
                    SwalButton.danger(
                      label: 'Eliminar',
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),
            ),
            const SwalButton.secondary(label: 'Deshabilitado', onPressed: null),
            SwalButton.secondary(
              label: 'Pequeno',
              size: SwalButtonSize.small,
              onPressed: () {},
            ),
          ],
        ),
        gap,
        const SwalSectionHeader(title: 'Tarjetas', kicker: 'Glass tactil'),
        LayoutBuilder(
          builder: (context, c) {
            final columns = c.maxWidth > 700 ? 3 : 1;
            final width =
                (c.maxWidth - SwalTokens.space4 * (columns - 1)) / columns;
            return Wrap(
              spacing: SwalTokens.space4,
              runSpacing: SwalTokens.space4,
              children: [
                SizedBox(
                  width: width,
                  child: const SwalCard(child: _Metric('Cobrado', '€ 12.480')),
                ),
                SizedBox(
                  width: width,
                  child: SwalCard(
                    selected: _selected,
                    onTap: () => setState(() => _selected = !_selected),
                    child: const _Metric('Seleccionable', 'Pulsa'),
                  ),
                ),
                SizedBox(
                  width: width,
                  child: const SwalCard(
                    blur: true,
                    elevated: true,
                    child: _Metric('Con blur', 'Elevada'),
                  ),
                ),
              ],
            );
          },
        ),
        gap,
        const SwalSectionHeader(title: 'Formularios'),
        const SwalTextField(label: 'Cliente', hint: 'Nombre o NIF'),
        const SizedBox(height: SwalTokens.space4),
        const SwalTextField(
          label: 'Referencia',
          hint: 'FZ-2026-0001',
          mono: true,
          prefixIcon: Icons.tag,
        ),
        const SizedBox(height: SwalTokens.space4),
        const SwalTextField(
          label: 'Correo',
          initialValue: 'ada@',
          errorText: 'Correo incompleto',
        ),
        const SizedBox(height: SwalTokens.space4),
        Wrap(
          spacing: SwalTokens.space2,
          children: [
            FilterChip(
              label: const Text('Pagadas'),
              selected: true,
              onSelected: (_) {},
            ),
            FilterChip(
              label: const Text('Pendientes'),
              selected: false,
              onSelected: (_) {},
            ),
            Switch(
              value: _selected,
              onChanged: (v) => setState(() => _selected = v),
            ),
            Checkbox(
              value: _selected,
              onChanged: (v) => setState(() => _selected = v!),
            ),
          ],
        ),
        gap,
        const SwalSectionHeader(title: 'Estados'),
        const Wrap(
          spacing: SwalTokens.space2,
          runSpacing: SwalTokens.space2,
          children: [
            SwalStatusBadge(label: 'Pagado', status: SwalStatus.success),
            SwalStatusBadge(label: 'Pendiente', status: SwalStatus.warning),
            SwalStatusBadge(label: 'Vencido', status: SwalStatus.danger),
            SwalStatusBadge(label: 'Nuevo', status: SwalStatus.info),
            SwalStatusBadge(label: 'Borrador'),
          ],
        ),
        gap,
        const SwalSectionHeader(title: 'Lista'),
        SwalCard(
          padding: const EdgeInsets.all(SwalTokens.space2),
          child: Column(
            children: [
              ListTile(
                selected: true,
                leading: const Icon(Icons.receipt_long_outlined),
                title: const Text('FZ-0042'),
                subtitle: const Text('Activa'),
                trailing: Text('€ 320', style: SwalTypography.of(context).mono),
                onTap: () {},
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.receipt_long_outlined),
                title: const Text('FZ-0041'),
                subtitle: const Text('Archivada'),
                trailing: Text('€ 95', style: SwalTypography.of(context).mono),
                onTap: () {},
              ),
            ],
          ),
        ),
        gap,
        const SwalCard(
          child: SwalEmptyState(
            title: 'Sin gastos todavia',
            message: 'Cuando registres un gasto aparecera aqui.',
            icon: Icons.savings_outlined,
          ),
        ),
      ],
    );
  }
}

class _Metric extends StatelessWidget {
  const _Metric(this.label, this.value);

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: text.bodySmall),
        const SizedBox(height: SwalTokens.space1),
        Text(value, style: text.headlineLarge),
      ],
    );
  }
}
