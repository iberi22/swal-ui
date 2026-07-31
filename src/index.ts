/**
 * @swal/ui — SWAL Design System
 *
 * Identidad visual unificada para todas las apps del ecosistema.
 * Extraído de edge-hive/edge-hive-admin (Hive Dark theme).
 */

// ——— Design Tokens ———
export { colors, typography, effects, spacing, borderRadius } from './tokens';
export { default as swalTailwindPreset } from './tokens/tailwind';

// ——— Core UI Components ———
export { Button, type ButtonProps } from './components/ui/Button';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/ui/Card';
export { StatusBadge, type StatusBadgeProps, type StatusType } from './components/ui/StatusBadge';

// ——— Utilities ———
export { cn } from './utils/cn';

// ——— Styles ———
import './styles/global.css';
