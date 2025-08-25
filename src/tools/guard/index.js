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
            ns: ctx.ns,
        });
        const hud = hudFactory("guard", "Guard", {
            width: 280,
            icon: GuardTool.icon,
        });

        const view = document.createElement("div");
        const label = document.createElement("div");
        const changeLabel = document.createElement("div");

        view.appendChild(label);
        view.appendChild(document.createElement("br"));
        view.appendChild(changeLabel);
        hud.setContent(view);

        let prevScale = (visualViewport && visualViewport.scale) || 1;

        const update = () => {
            const scale = (visualViewport && visualViewport.scale) || 1;
            label.textContent = `scale: ${scale.toFixed(
                2
            )} | viewport: ${innerWidth}×${innerHeight}`;
            if (scale !== prevScale) {
                changeLabel.textContent = `zoom changed: ${prevScale.toFixed(
                    2
                )} → ${scale.toFixed(2)}`;
                prevScale = scale;
            }
        };
        const off1 = ctx.bus.on && ctx.bus.on("viewport:change", update);
        update();

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
