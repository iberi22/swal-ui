import { describe, it, expect } from 'vitest';
import { swalFade, swalSlide } from '../src/lib/motion.js';
import { toast, toasts } from '../src/lib/toast.svelte.js';

describe('SWAL UI Smoke Test', () => {
  it('should compute swalFade transitions correctly', () => {
    // Mock getComputedStyle
    const originalGetComputedStyle = globalThis.getComputedStyle;
    globalThis.getComputedStyle = () => ({ opacity: '1' });

    const mockNode = {};
    const transition = swalFade(mockNode, { duration: 150 });

    expect(transition.duration).toBe(150);
    expect(transition.css(0.5)).toContain('opacity: 0.5');

    // Restore
    globalThis.getComputedStyle = originalGetComputedStyle;
  });

  it('should handle toast notifications', () => {
    expect(toasts.length).toBe(0);

    const id = toast.success('Test Toast', 'Success Title');
    expect(toasts.length).toBe(1);
    expect(toasts[0].id).toBe(id);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('Test Toast');
    expect(toasts[0].title).toBe('Success Title');

    toast.dismiss(id);
    expect(toasts.length).toBe(0);
  });
});
