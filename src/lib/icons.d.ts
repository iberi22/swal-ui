/**
 * Anade o sobrescribe iconos del registro. Cada valor es un array de `d` de <path>.
 * @param {Record<string, readonly string[]>} map
 */
export function registerIcons(map: Record<string, readonly string[]>): void;
/** Paths de un icono, o undefined si no esta registrado. */
export function getIcon(name: any): any;
export namespace ICONS {
    export let home: string[];
    export let table: string[];
    export let clipboard: string[];
    export let chef: string[];
    let _package: string[];
    export { _package as package };
    export let utensils: string[];
    export let book: string[];
    export let receipt: string[];
    export let device: string[];
    export let wifi: string[];
    export let qr: string[];
    export let login: string[];
    export let menu: string[];
    export let close: string[];
    export let user: string[];
    export let heart: string[];
    export let activity: string[];
    export let calendar: string[];
    export let chart: string[];
    export let sliders: string[];
    export let check: string[];
}
