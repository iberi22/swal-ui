/**
 * @swal/ui/prefs — resolve — Funciones puras: preferencias guardadas + esquema → preferencias validas.
 *
 * Todo lo que llega guardado (localStorage, servidor) es no confiable: claves desconocidas se
 * descartan, tipos equivocados vuelven al valor por defecto, los modulos y paneles `required`
 * quedan siempre activos y los numeros se acotan a [min, max]. Asi una version vieja o un
 * cliente manipulado no puede dejar la interfaz sin menu.
 */
const isObj = (v) => !!v && typeof v === "object" && !Array.isArray(v);
function optionValue(def, raw) {
  switch (def.type) {
    case "toggle":
      return typeof raw === "boolean" ? raw : def.default;
    case "select":
      return typeof raw === "string" && (def.choices ?? []).some((c) => c.value === raw) ? raw : def.default;
    case "number": {
      if (typeof raw !== "number" || !Number.isFinite(raw)) return def.default;
      const lo = def.min ?? -Infinity;
      const hi = def.max ?? Infinity;
      return Math.min(hi, Math.max(lo, raw));
    }
    default:
      return def.default;
  }
}
function defaultPrefs(schema) {
  return resolvePrefs(schema, void 0);
}
function resolvePrefs(schema, stored) {
  const src = isObj(stored) ? stored : {};
  const mods = isObj(src.modules) ? src.modules : {};
  const pans = isObj(src.panels) ? src.panels : {};
  const modules = {};
  for (const m of schema.modules) {
    const v = mods[m.id];
    modules[m.id] = m.required ? true : typeof v === "boolean" ? v : m.default;
  }
  const panels = {};
  for (const p of schema.panels) {
    const raw = isObj(pans[p.id]) ? pans[p.id] : {};
    const rawOpts = isObj(raw.options) ? raw.options : {};
    const options = {};
    for (const o of p.options ?? []) options[o.id] = optionValue(o, rawOpts[o.id]);
    panels[p.id] = {
      enabled: p.required ? true : typeof raw.enabled === "boolean" ? raw.enabled : p.default,
      options
    };
  }
  const preset = typeof src.preset === "string" && (schema.presets ?? []).some((x) => x.id === src.preset) ? src.preset : void 0;
  return {
    version: schema.version,
    onboarded: src.version === schema.version && src.onboarded === true,
    ...preset ? { preset } : {},
    modules,
    panels,
    ...typeof src.updatedAt === "string" ? { updatedAt: src.updatedAt } : {}
  };
}
function applyPreset(schema, prefs, presetId) {
  const preset = (schema.presets ?? []).find((p) => p.id === presetId);
  if (!preset) return prefs;
  const next = { ...prefs, preset: presetId, modules: { ...prefs.modules }, panels: { ...prefs.panels } };
  for (const [id, on] of Object.entries(preset.modules ?? {})) if (id in next.modules) next.modules[id] = on;
  for (const [id, on] of Object.entries(preset.panels ?? {})) if (id in next.panels) next.panels[id] = { ...next.panels[id], enabled: on };
  return resolvePrefs(schema, next);
}
function isModuleEnabled(prefs, id) {
  return prefs.modules[id] !== false;
}
function isPanelEnabled(prefs, id) {
  return prefs.panels[id]?.enabled !== false;
}
function panelOption(prefs, panelId, optionId, fallback) {
  const v = prefs.panels[panelId]?.options?.[optionId];
  return v === void 0 ? fallback : v;
}
function moduleGroups(schema) {
  const out = [];
  for (const m of schema.modules) {
    let g = out.find((x) => x.group === m.group);
    if (!g) out.push(g = { group: m.group, modules: [] });
    g.modules.push(m);
  }
  return out;
}
function panelScopes(schema) {
  const out = [];
  for (const p of schema.panels) {
    let g = out.find((x) => x.scope === p.scope);
    if (!g) out.push(g = { scope: p.scope, panels: [] });
    g.panels.push(p);
  }
  return out;
}
export {
  applyPreset,
  defaultPrefs,
  isModuleEnabled,
  isPanelEnabled,
  moduleGroups,
  panelOption,
  panelScopes,
  resolvePrefs
};
