// src/tools/guard/index.js
import { createHudFactory } from "../../ui/hud/hud-factory.js";

let cleanup = null;

export const GuardTool = {
    id: "guard",
    name: "Guard",
    icon: "🛡️",
    init(ctx) {
        const hudFactory = createHudFactory({
            shadowRoot: ctx.shadowRoot,
            bus: ctx.bus,
        });
        const hud = hudFactory("guard", "Guard", {
            width: 280,
            icon: GuardTool.icon,
        });

        const view = document.createElement("div");
        const label = document.createElement("div");
        const btnScan = document.createElement("button");
        btnScan.textContent = "Overflow scan";
        btnScan.style.cursor = "pointer";

        view.appendChild(label);
        view.appendChild(document.createElement("br"));
        view.appendChild(btnScan);
        hud.setContent(view);

        const update = () => {
            const scale = (visualViewport && visualViewport.scale) || 1;
            label.textContent = `scale: ${scale.toFixed(
                2
            )} | viewport: ${innerWidth}×${innerHeight}`;
        };
        const off1 = ctx.bus.on && ctx.bus.on("viewport:change", update);
        update();

        function scanOverflow() {
            const offenders = [];
            document.querySelectorAll("body *").forEach((el) => {
                const sw = el.scrollWidth,
                    cw = el.clientWidth,
                    sh = el.scrollHeight,
                    ch = el.clientHeight;
                if (sw > cw + 1 || sh > ch + 1) offenders.push(el);
            });
            offenders.forEach((el) => {
                const prev = el.style.outline;
                el.style.outline = "2px dashed rgba(255,80,80,.85)";
                setTimeout(() => {
                    el.style.outline = prev;
                }, 1500);
            });
        }
        btnScan.onclick = scanOverflow;

        cleanup = () => {
            off1 && off1();
            hud.destroy();
        };
    },
    destroy() {
        cleanup && cleanup();
        cleanup = null;
    },
};
