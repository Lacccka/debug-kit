// tools/layout-debug/index.js — CLS/подсветка shift/overflow (шаг 6).
import { createHudFactory } from "../../ui/hud/hud-factory.js";
import { highlightElement, scanOverflow } from "../../ui/hud/hud-utils.js";
import { createClsObserver } from "./cls-observer.js";

let cleanup = null;

export const LayoutDebugTool = {
    id: "layout-debug",
    name: "Layout",
    icon: "📐",
    init(ctx) {
        const hudFactory = createHudFactory({
            shadowRoot: ctx.shadowRoot,
            bus: ctx.bus,
            ns: ctx.ns,
        });
        const hud = hudFactory("layout-debug", "Layout", {
            width: 260,
            icon: LayoutDebugTool.icon,
        });

        const view = document.createElement("div");
        const clsLabel = document.createElement("div");
        const btnReset = document.createElement("button");
        btnReset.textContent = "Reset CLS";
        btnReset.classList.add("btn");
        const btnOverflow = document.createElement("button");
        btnOverflow.textContent = "Scan overflow";
        btnOverflow.classList.add("btn");

        view.appendChild(clsLabel);
        view.appendChild(document.createElement("br"));
        view.appendChild(btnReset);
        view.appendChild(document.createTextNode(" "));
        view.appendChild(btnOverflow);
        hud.setContent(view);

        const clsObs = createClsObserver(({ entry, value }) => {
            clsLabel.textContent = `CLS: ${value.toFixed(4)}`;
            entry.sources?.forEach((s) => {
                const node = s.node;
                if (node && node.style) {
                    highlightElement(node, "dk-outline-info");
                }
            });
        });

        btnReset.onclick = () => {
            clsObs.reset();
            clsLabel.textContent = "CLS: 0.0000";
        };

        btnOverflow.onclick = () => scanOverflow();

        cleanup = () => {
            clsObs.disconnect();
            hud.destroy();
        };
    },
    destroy() {
        cleanup && cleanup();
        cleanup = null;
    },
};
