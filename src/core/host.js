export function createHost() {
    const host = document.createElement("div");
    host.id = "debugkit-host";
    Object.assign(host.style, {
        all: "initial",
        position: "fixed",
        inset: "0",
        zIndex: "2147483647",
        pointerEvents: "none",
    });
    document.documentElement.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: "open" });
    // основные слои

    const root = document.createElement("div");
    root.className = "dk-panel-root";
    root.style.pointerEvents = "auto";
    root.style.zIndex = "2";
    shadowRoot.appendChild(root);

    const panel = document.createElement("div");
    panel.className = "dk-panel";
    panel.style.pointerEvents = "auto"; // <<< важно для кликов по панели
    panel.style.zIndex = "2";
    shadowRoot.appendChild(panel);

    const hudRoot = document.createElement("div");
    hudRoot.className = "dk-hud-root";
    hudRoot.style.pointerEvents = "none";
    hudRoot.style.zIndex = "2";
    shadowRoot.appendChild(hudRoot);
    return { host, shadowRoot, root, panel, hudRoot };
}
