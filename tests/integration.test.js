import { describe, it, expect } from 'vitest';
import * as components from '../src/components/index.js';
import { colors, typography, effects, spacing, borderRadius } from '../src/tokens/index.ts';

describe('SWAL UI Integration Test', () => {
  it('should export all 18 components correctly', () => {
    const expectedComponents = [
      'Button',
      'Card',
      'Badge',
      'Input',
      'Table',
      'Tabs',
      'Skeleton',
      'Modal',
      'StatusBadge',
      'LoadingState',
      'Terminal',
      'CommandPalette',
      'Toaster',
      'LogViewer',
      'ConfigEditor',
      'DashboardLayout',
      'GlobalTicker',
      'Landing'
    ];

    expectedComponents.forEach((componentName) => {
      expect(components[componentName]).toBeDefined();
      const type = typeof components[componentName];
      expect(type === 'function' || type === 'object').toBe(true);
    });
  });

  it('should have valid design tokens', () => {
    // Colors
    expect(colors.background.deepest).toBe('#020617');
    expect(colors.accent.orange).toBe('#f97316');
    expect(colors.accent.cyan).toBe('#06b6d4');

    // Typography
    expect(typography.fontFamily.sans).toContain('Inter');
    expect(typography.fontFamily.mono).toContain('monospace');

    // Effects
    expect(effects.animations.marquee).toBeDefined();

    // Spacing & Border Radius
    expect(spacing['4']).toBe('16px');
    expect(borderRadius.md).toBe('0.375rem');
  });
});
