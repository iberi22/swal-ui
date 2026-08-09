import { describe, it, expect } from 'vitest';
import DashboardLayout from '../src/lib/components/layout/DashboardLayout.svelte';
import GlobalTicker from '../src/lib/components/widgets/GlobalTicker.svelte';
import Landing from '../src/pages/Landing.svelte';

describe('DashboardLayout Component', () => {
  it('should be a valid Svelte component', () => {
    expect(DashboardLayout).toBeDefined();
    const type = typeof DashboardLayout;
    expect(type === 'function' || type === 'object').toBe(true);
  });
});

describe('GlobalTicker Component', () => {
  it('should be a valid Svelte component', () => {
    expect(GlobalTicker).toBeDefined();
    const type = typeof GlobalTicker;
    expect(type === 'function' || type === 'object').toBe(true);
  });
});

describe('Landing Component', () => {
  it('should be a valid Svelte component', () => {
    expect(Landing).toBeDefined();
    const type = typeof Landing;
    expect(type === 'function' || type === 'object').toBe(true);
  });
});
