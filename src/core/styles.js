const BASE_CSS = `
:host {
  --dk-bg:#101114;
  --dk-fg:#e6e7ea;
  --dk-accent:#5aa6ff;
  --dk-shadow:0 6px 24px rgba(0,0,0,.24);
  --dk-radius:10px;
  font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
}

/* toggle */
.dk-root{position:fixed;bottom:16px;right:16px;pointer-events:auto}
.dk-toggle{width:40px;height:40px;border-radius:999px;background:var(--dk-bg);color:var(--dk-fg);box-shadow:var(--dk-shadow);display:grid;place-items:center;cursor:pointer}

/* panel */
.dk-panel{position:fixed;bottom:64px;right:16px;width:360px;max-height:70vh;
  background:linear-gradient(180deg,#111318cc,#0e0f13cc);
  color:var(--dk-fg);border:1px solid #23252b;border-radius:12px;
  box-shadow:var(--dk-shadow);display:none;overflow:auto;
  backdrop-filter:blur(8px) saturate(115%); pointer-events:auto}
.dk-panel.open{display:block}
.dk-panel__header{position:sticky;top:0;display:flex;align-items:center;gap:8px;padding:10px;background:#111318cc;border-bottom:1px solid #23252b}
.dk-panel__header .ttl{font-weight:700}
.dk-panel__header .srch{margin-left:auto;width:60%;background:#15171c;color:var(--dk-fg);border:1px solid #2a2d35;border-radius:8px;padding:6px 8px}

/* panel body */
.dk-panel__body{padding:10px;display:grid;gap:12px}
.dk-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.dk-card{background:#15171c;border:1px solid #23252b;border-radius:10px;padding:10px}
.dk-card__row{display:flex;align-items:center;justify-content:space-between}
.dk-card__head{display:flex;align-items:center;gap:6px;font-weight:600}

/* switch */
.dk-switch{position:relative;width:40px;height:22px}
.dk-switch input{display:none}
.dk-switch .slider{position:absolute;inset:0;background:#2a2d35;border-radius:999px;cursor:pointer;transition:.2s}
.dk-switch .slider:before{content:"";position:absolute;height:16px;width:16px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s}
.dk-switch input:checked + .slider{background:#2f7dff}
.dk-switch input:checked + .slider:before{transform:translateX(18px)}

/* hud */
.dk-hud-layer{position:fixed;inset:0;pointer-events:auto}
.dk-hud{position:fixed;min-width:260px;max-width:320px;background:#14161a;border-radius:var(--dk-radius);box-shadow:var(--dk-shadow);pointer-events:auto}
.dk-hud .hdr{display:flex;align-items:center;gap:8px;padding:8px;background:#191b20;cursor:move; pointer-events:auto}
`;

export function attachBaseStyles(shadowRoot) {
    // adoptable stylesheet fallback
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
