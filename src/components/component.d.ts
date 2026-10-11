/**
 * Shared type shape for every Svelte component shipped by `@swal/ui`.
 * Components are untyped (props vary per component — see USAGE.md);
 * this resolves module types for consumers without `any` leaking
 * through an unresolved import.
 */
import type { Component } from 'svelte';

declare const compat: Component;
export default compat;
