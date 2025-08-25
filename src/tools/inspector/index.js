// tools/inspector/index.js — highlight element under cursor and show info in HUD.
import { createHudFactory } from "../../ui/hud/hud-factory.js";

let cleanup = null;

export const InspectorTool = {
    id: "inspector",
    name: "Inspector",
    icon: "\uD83D\uDD0D", // magnifying glass
    init(ctx) {
        const hudFactory = createHudFactory({
            shadowRoot: ctx.shadowRoot,
            bus: ctx.bus,
            ns: ctx.ns,
        });
        const hud = hudFactory("inspector", "Inspector", {
            icon: InspectorTool.icon,
            width: 200,
        });

        const info = document.createElement("div");
        hud.setContent(info);

        let highlighted = null;
        let prevOutline = "";

        const onMove = (e) => {
            const el = e.target;
            if (!(el && el.nodeType === 1) || el === highlighted) {
                return;
            }
            if (highlighted) {
                highlighted.style.outline = prevOutline;
            }
            highlighted = el;
            prevOutline = el.style.outline;
            const rect = el.getBoundingClientRect();
            el.style.outline = "2px solid rgba(255,80,80,0.85)";
            info.textContent = `${el.tagName.toLowerCase()} ${Math.round(
                rect.width
            )}×${Math.round(rect.height)}`;
        };

        document.addEventListener("mousemove", onMove);

        cleanup = () => {
            document.removeEventListener("mousemove", onMove);
            if (highlighted) {
                highlighted.style.outline = prevOutline;
            }
            hud.destroy();
        };
    },
    destroy() {
        cleanup && cleanup();
        cleanup = null;
    },
};
