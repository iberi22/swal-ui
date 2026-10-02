// Primitivos
export { default as Button } from './Button.svelte';
export { default as Card } from './Card.svelte';
export { default as Badge } from './Badge.svelte';
export { default as Input } from './Input.svelte';
export { default as Table } from './Table.svelte';
export { default as Tabs } from './Tabs.svelte';
export { default as Skeleton } from './Skeleton.svelte';
export { default as Modal } from './Modal.svelte';

// Edge-Hive (portados de edge-hive-admin)
export { default as StatusBadge } from './StatusBadge.svelte';
export { default as LoadingState } from './LoadingState.svelte';
export { default as Terminal } from './Terminal.svelte';
export { default as CommandPalette } from './CommandPalette.svelte';
export { default as Toaster } from './Toaster.svelte';
export { default as LogViewer } from './LogViewer.svelte';
export { default as ConfigEditor } from './ConfigEditor.svelte';

// New Components
export { default as DashboardLayout } from './DashboardLayout.svelte';
export { default as GlobalTicker } from './GlobalTicker.svelte';
export { default as Landing } from './Landing.svelte';
export { default as QRCode } from './QRCode.svelte';

// App shell generico (extraido del rediseno de Fize)
export { default as Icon } from './Icon.svelte';
export { default as MobileNav } from './MobileNav.svelte';
export { default as AppShell } from './AppShell.svelte';
export { ICONS, registerIcons, getIcon } from '../lib/icons.js';
export { isNavActive, findCurrentNav } from '../lib/nav.js';
export { THEME_BOOT_SCRIPT, themeBootScript, setTheme } from '../lib/theme-boot.js';
