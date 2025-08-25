import { createHudFactory } from "../../ui/hud/hud-factory.js";
import { storage } from "../../core/storage.js";

let cleanup = null;

export const LighthouseTool = {
    id: "lighthouse",
    name: "Lighthouse",
    icon: "🚨",
    init(ctx) {
        const hudFactory = createHudFactory({
            shadowRoot: ctx.shadowRoot,
            bus: ctx.bus,
            ns: ctx.ns,
        });
        const hud = hudFactory("lighthouse", "Lighthouse", {
            icon: LighthouseTool.icon,
            width: 260,
        });

        const view = document.createElement("div");
        const pre = document.createElement("pre");
        pre.textContent = "Loading...";
        view.appendChild(pre);
        hud.setContent(view);

        const targetUrl = storage.getItem(
            ctx.ns + "lhUrl",
            "https://example.com"
        );
        const strategy = storage.getItem(ctx.ns + "lhStrategy", "mobile");

        // Expects a `/lighthouse` endpoint on the same origin
        // that returns Lighthouse results in JSON format.
        const apiUrl = new URL("/lighthouse", window.location.origin);
        apiUrl.searchParams.set("url", targetUrl);
        apiUrl.searchParams.set("strategy", strategy);

        fetch(apiUrl.toString())
            .then((r) => r.json())
            .then((data) => {
                const score =
                    data?.lighthouseResult?.categories?.performance?.score;
                if (typeof score === "number") {
                    pre.textContent = `Performance: ${Math.round(score * 100)}`;
                } else {
                    pre.textContent = "No result";
                }
            })
            .catch(() => {
                pre.textContent = "Error";
            });

        cleanup = () => {
            hud.destroy();
        };
    },
    destroy() {
        cleanup && cleanup();
        cleanup = null;
    },
};
