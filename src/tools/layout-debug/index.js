// tools/layout-debug/index.js — CLS/подсветка shift/overflow (шаг 6).
import { createHudFactory } from "../../ui/hud/hud-factory.js";
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
        });
        const hud = hudFactory("layout-debug", "Layout", {
            width: 260,
            icon: LayoutDebugTool.icon,
        });

        const view = document.createElement("div");
        const clsLabel = document.createElement("div");
        const btnReset = document.createElement("button");
        btnReset.textContent = "Reset CLS";
        btnReset.style.cursor = "pointer";
        const btnOverflow = document.createElement("button");
        btnOverflow.textContent = "Scan overflow";
        btnOverflow.style.cursor = "pointer";

        view.appendChild(clsLabel);
        view.appendChild(document.createElement("br"));
        view.appendChild(btnReset);
        view.appendChild(document.createTextNode(" "));
        view.appendChild(btnOverflow);
        hud.setContent(view);

        const highlight = (el, style) => {
            const prev = el.style.outline;
            el.style.outline = style;
            setTimeout(() => {
                el.style.outline = prev;
            }, 1500);
        };

        const clsObs = createClsObserver(({ entry, value }) => {
            clsLabel.textContent = `CLS: ${value.toFixed(4)}`;
            entry.sources?.forEach((s) => {
                const node = s.node;
                if (node && node.style) {
                    highlight(node, "2px solid rgba(50,150,255,0.9)");
                }
            });
        });

        btnReset.onclick = () => {
            clsObs.reset();
            clsLabel.textContent = "CLS: 0.0000";
        };

        const scanOverflow = () => {
            const offenders = [];
            document.querySelectorAll("body *").forEach((el) => {
                const sw = el.scrollWidth,
                    cw = el.clientWidth,
                    sh = el.scrollHeight,
                    ch = el.clientHeight;
                if (sw > cw + 1 || sh > ch + 1) offenders.push(el);
            });
            offenders.forEach((el) => {
                highlight(el, "2px dashed rgba(255,80,80,.85)");
            });
        };
        btnOverflow.onclick = scanOverflow;

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
