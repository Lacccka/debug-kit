// base-styles.js

export const BASE_CSS = `
:host {
  /* THEME TOKENS */
  --dk-z: 2147483000;
  --dk-radius: 12px;
  --dk-gap: 10px;

  /* Dark (default) */
  --dk-bg:#101114;
  --dk-bg-2:#111318cc;
  --dk-bg-3:#15171c;
  --dk-surface:#14161a;
  --dk-border:#23252b;
  --dk-fg:#e6e7ea;
  --dk-fg-muted:#b8bbc4;
  --dk-accent:#5aa6ff;
  --dk-accent-strong:#2f7dff;
  --dk-shadow:0 8px 28px rgba(0,0,0,.28);

  font:13px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,Arial,Helvetica,sans-serif;
  color-scheme: dark light;
}

/* Light theme opt-in via attribute or prefers-color-scheme */
:host([theme="light"]),
:host(:not([theme="dark"])):host-context([data-theme="light"]) {
  --dk-bg:#ffffff;
  --dk-bg-2:#ffffffcc;
  --dk-bg-3:#f5f6f8;
  --dk-surface:#ffffff;
  --dk-border:#e3e5ea;
  --dk-fg:#0b0c0f;
  --dk-fg-muted:#4b4f59;
  --dk-accent:#2f7dff;
  --dk-accent-strong:#1a5fff;
  --dk-shadow:0 8px 28px rgba(16,24,40,.18);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}

/* toggle */
.dk-root{position:fixed;inset:auto 16px 16px auto;pointer-events:none;z-index:var(--dk-z)}
.dk-toggle{
  width:42px;height:42px;border-radius:999px;
  background:var(--dk-bg);color:var(--dk-fg);
  box-shadow:var(--dk-shadow);display:grid;place-items:center;
  cursor:pointer;transition:background .2s, transform .08s ease-out, color .2s;
  pointer-events:auto;border:1px solid var(--dk-border);
  -webkit-tap-highlight-color: transparent;
}
.dk-toggle:hover{background:var(--dk-accent);color:#fff}
.dk-toggle:active{transform:translateY(1px) scale(.98)}
.dk-toggle:focus-visible{
  outline:2px solid color-mix(in oklab, var(--dk-accent) 70%, transparent);
  outline-offset:2px;
  box-shadow:0 0 0 4px color-mix(in oklab, var(--dk-accent) 25%, transparent);
  border-color:transparent;
}

/* panel */
.dk-panel{
  position:fixed;bottom:72px;right:16px;width:360px;max-height:72vh;
  background:linear-gradient(180deg,var(--dk-bg-2), var(--dk-bg-2));
  color:var(--dk-fg);border:1px solid var(--dk-border);border-radius:14px;
  box-shadow:var(--dk-shadow);overflow:auto;pointer-events:auto;
  backdrop-filter:saturate(115%) blur(8px);
  -webkit-backdrop-filter:saturate(115%) blur(8px);
  opacity:0;transform:translateY(8px) scale(.985);transition:opacity .18s, transform .18s;
  visibility:hidden;
}
@supports not (backdrop-filter: blur(8px)) {
  .dk-panel{ background:var(--dk-surface); }
}
.dk-panel.open{opacity:1;transform:none;visibility:visible}
.dk-panel__header{
  position:sticky;top:0;display:flex;align-items:center;gap:8px;
  padding:10px;background:var(--dk-bg-2);
  border-bottom:1px solid var(--dk-border);
  backdrop-filter:inherit;-webkit-backdrop-filter:inherit;
}
.dk-panel__header .ttl{font-weight:700;letter-spacing:.2px}
  .dk-panel__header .srch{
    margin-left:auto;width:60%;
    background:var(--dk-bg-3);color:var(--dk-fg);
    border:1px solid var(--dk-border);border-radius:10px;padding:8px 10px;
    outline: none;transition:border-color .15s, box-shadow .15s;
  }
.dk-panel__header .srch::placeholder{color:var(--dk-fg-muted)}
.dk-panel__header .srch:focus{
  border-color: color-mix(in oklab, var(--dk-accent) 65%, var(--dk-border));
  box-shadow:0 0 0 3px color-mix(in oklab, var(--dk-accent) 25%, transparent);
}

/* panel body */
  .dk-panel__body{padding:12px;display:grid;gap:12px}
  .dk-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--dk-gap)}
  @media (max-width: 420px){
    .dk-panel{width:min(92vw, 360px);right:4px;left:4px}
    .dk-grid{grid-template-columns:1fr}
    .dk-panel__header .srch{width:100%}
  }

/* cards */
.dk-card{
  background:var(--dk-bg-3);border:1px solid var(--dk-border);
  border-radius:var(--dk-radius);padding:10px;transition:border-color .15s, box-shadow .15s;
}
.dk-card:focus-within{
  border-color: color-mix(in oklab, var(--dk-accent) 65%, var(--dk-border));
  box-shadow:0 0 0 3px color-mix(in oklab, var(--dk-accent) 22%, transparent);
}
.dk-card__row{display:flex;align-items:center;justify-content:space-between;gap:10px}
.dk-card__head{display:flex;align-items:center;gap:8px;font-weight:600}

/* form controls */
.dk-card select,
.dk-panel select,
.dk-panel input[type="text"],
.dk-panel input[type="search"]{
  background:var(--dk-bg-3);color:var(--dk-fg);
  border:1px solid var(--dk-border);border-radius:10px;padding:8px 10px;
  min-height:36px;line-height:1.2;
}
.dk-card select:focus,
.dk-panel select:focus{
  outline:none;border-color: color-mix(in oklab, var(--dk-accent) 65%, var(--dk-border));
  box-shadow:0 0 0 3px color-mix(in oklab, var(--dk-accent) 22%, transparent);
}

/* switch */
.dk-switch{position:relative;width:44px;height:24px;flex:0 0 auto}
.dk-switch input{appearance:none;-webkit-appearance:none;position:absolute;inset:0;opacity:0}
.dk-switch .slider{
  position:absolute;inset:0;background:var(--dk-border);
  border-radius:999px;cursor:pointer;transition:background .18s, box-shadow .18s;
}
.dk-switch .slider:before{
  content:"";position:absolute;height:18px;width:18px;left:3px;top:3px;
  background:#fff;border-radius:50%;transition:transform .18s, background .18s, box-shadow .18s;
  box-shadow:0 1px 2px rgba(0,0,0,.2);
}
.dk-switch input:checked + .slider{background:var(--dk-accent-strong)}
.dk-switch input:checked + .slider:before{transform:translateX(20px)}
.dk-switch input:focus-visible + .slider{
  box-shadow:0 0 0 3px color-mix(in oklab, var(--dk-accent) 30%, transparent);
}

/* hud */
.dk-hud-layer{position:fixed;inset:0;pointer-events:none;z-index:var(--dk-z)}
  .dk-hud{
    position:fixed;width:260px;max-width:340px;
    background:var(--dk-surface);border:1px solid var(--dk-border);
    border-radius:var(--dk-radius);box-shadow:var(--dk-shadow);
    pointer-events:auto;overflow:hidden;
  }
  @media (max-width:300px){.dk-hud{width:calc(100% - 32px);}}
.dk-hud .hdr{
  display:flex;align-items:center;gap:8px;padding:8px 10px;
  background:color-mix(in oklab, var(--dk-surface) 85%, #000 15%);
  cursor:move; user-select:none;
}

/* scrollbar (WebKit/Chromium) */
.dk-panel::-webkit-scrollbar{width:10px;height:10px}
.dk-panel::-webkit-scrollbar-thumb{
  background:color-mix(in oklab, var(--dk-border) 70%, #000 30%);
  border-radius:999px;border:2px solid transparent;background-clip:content-box;
}
.dk-panel::-webkit-scrollbar-thumb:hover{
  background:color-mix(in oklab, var(--dk-border) 50%, #000 50%);
  background-clip:content-box;border-radius:999px;
}

/* utility */
.dk-sep{height:1px;background:var(--dk-border);margin:.25rem 0}
/* overlays */
.dk-overlay{position:fixed;inset:0;pointer-events:none}
.dk-grid-overlay{z-index:1}
.dk-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(2px);pointer-events:auto;opacity:0;transition:opacity .18s ease-out;visibility:hidden}
.dk-backdrop.open{opacity:1;visibility:visible}
.dk-overlay--passthrough{pointer-events:none}
`;

/**
 * Применяет базовые стили в теневой корень.
 * Работает как с adoptedStyleSheets, так и с fallback на <style>.
 */
export function attachBaseStyles(shadowRoot) {
    if (!shadowRoot) return;

    try {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(BASE_CSS);
        shadowRoot.adoptedStyleSheets = [
            ...shadowRoot.adoptedStyleSheets,
            sheet,
        ];
    } catch {
        const style = document.createElement("style");
        style.textContent = BASE_CSS;
        shadowRoot.appendChild(style);
    }
}
