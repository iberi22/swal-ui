/**
 * @swal/ui/prefs — bootstrap — Script en linea que oculta lo desactivado antes de pintar.
 *
 * Igual que el bootstrap del tema: va en el <head>, lee las preferencias de localStorage y
 * escribe una hoja `<style id="swal-prefs-style">` con
 *   [data-pref-module="x"], [data-pref-panel="y"] { display: none !important }
 * para cada modulo o panel apagado. Cualquier elemento marcado con esos atributos (una
 * entrada del menu, una seccion del dashboard) se oculta sin parpadeo y sin que su
 * componente sepa de preferencias. Se re-aplica con `swal:prefschange` (el store lo emite
 * al cargar o guardar) y tras `astro:after-swap` (navegacion con ClientRouter).
 *
 * localStorage es solo cache: lo peor que puede hacer un valor manipulado es ocultarle algo
 * al propio usuario. Los modulos `required` ya vienen resueltos como activos.
 */
function prefsBootstrapScript(opts = {}) {
  const cfg = JSON.stringify({
    key: opts.storageKey ?? "swal:prefs",
    mod: opts.moduleAttr ?? "data-pref-module",
    pan: opts.panelAttr ?? "data-pref-panel"
  });
  return `(function(){var C=${cfg};
function esc(s){return String(s).replace(/["\\\\]/g,'\\\\$&');}
function css(p){var sel=[];if(!p||typeof p!=='object')return '';
var m=p.modules||{};for(var k in m)if(m[k]===false)sel.push('['+C.mod+'="'+esc(k)+'"]');
var q=p.panels||{};for(var j in q)if(q[j]&&q[j].enabled===false)sel.push('['+C.pan+'="'+esc(j)+'"]');
return sel.length?sel.join(',')+'{display:none!important}':'';}
function apply(p){if(p===undefined){try{p=JSON.parse(localStorage.getItem(C.key)||'null');}catch(e){p=null;}}
var el=document.getElementById('swal-prefs-style');if(!el){el=document.createElement('style');el.id='swal-prefs-style';document.head.appendChild(el);}
el.textContent=css(p);}
apply();
document.addEventListener('swal:prefschange',function(e){apply(e.detail);});
document.addEventListener('astro:after-swap',function(){apply();});
window.swalPrefs=window.swalPrefs||{};window.swalPrefs.apply=apply;})();`;
}
export {
  prefsBootstrapScript
};
