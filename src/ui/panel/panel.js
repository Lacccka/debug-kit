import { renderList } from "./search.js";
import { renderGlobalSettings } from "./settings-global.js";

export function createPanel({
    bus,
    registry,
    storage,
    shadowRoot,
    ns,
    loadPlugin,
}) {
    const root = shadowRoot.querySelector(".dk-panel-root");
    const panel = shadowRoot.querySelector(".dk-panel");
    let locked = storage.getItem(ns + "panelLock", "0") === "1";

    const toggle = document.createElement("button");
    toggle.className = "dk-toggle";
    toggle.title = "DebugKit";
    toggle.innerHTML = "&#9881;";
    root.appendChild(toggle);

    const api = {
        open() {
            panel.classList.add("is-open");
        },
        close() {
            if (!locked) panel.classList.remove("is-open");
        },
        toggle() {
            if (locked) panel.classList.add("is-open");
            else panel.classList.toggle("is-open");
        },
        toggleState() {
            return panel.classList.contains("is-open");
        },
    };
    toggle.addEventListener("click", () => api.toggle());

    bus.on("panel:lock", (v) => {
        locked = v;
        if (locked) panel.classList.add("is-open");
    });

    if (locked) panel.classList.add("is-open");

    function render() {
        panel.innerHTML = "";

        const header = document.createElement("div");
        header.className = "dk-panel__header";
        header.innerHTML = `
      <div class="ttl">Debug-Kit</div>
      <input class="srch" type="search" placeholder="Поиск инструментов…" />
    `;

        const body = document.createElement("div");
        body.className = "dk-panel__body";

        const list = renderList({ registry }); // сам отрисует список
        const globals = renderGlobalSettings({
            storage,
            ns,
            bus,
            registry,
            loadPlugin,
        });
        body.appendChild(list);
        body.appendChild(globals);

        panel.appendChild(header);
        panel.appendChild(body);

        // Повесим поиск
        const input = header.querySelector(".srch");
        if (input) {
            input.addEventListener("input", () => {
                // пробросим событие фильтра в список
                const e = new CustomEvent("dk:filter", {
                    detail: input.value.trim().toLowerCase(),
                });
                list.dispatchEvent(e);
            });
        }
    }

    bus.on("registry:change", render);
    bus.on("tool:state", render);
    render();

    return api;
}
