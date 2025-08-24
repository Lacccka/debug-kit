// tools/perf-hud/index.js — FPS/long tasks/heap (шаг 8).
// Creates HUD that displays FPS, long task count and JS heap usage.

import { createHudFactory } from "../../ui/hud/hud-factory.js";
import { createCounters } from "./counters.js";

let cleanup = null;

export const PerfHudTool = {
    id: "perf",
    name: "Performance HUD",
    icon: "⏱️",
    init(ctx) {
        const hudFactory = createHudFactory({
            shadowRoot: ctx.shadowRoot,
            bus: ctx.bus,
        });
        const hud = hudFactory("perf", "Performance", {
            icon: PerfHudTool.icon,
            width: 200,
        });

        const view = document.createElement("div");
        const fpsEl = document.createElement("div");
        const taskEl = document.createElement("div");
        const heapEl = document.createElement("div");
        view.appendChild(fpsEl);
        view.appendChild(taskEl);
        view.appendChild(heapEl);
        hud.setContent(view);

        const render = ({ fps, longTasks, jsHeap }) => {
            fpsEl.textContent = `FPS: ${fps}`;
            taskEl.textContent = `Long tasks: ${longTasks}`;
            const mb = jsHeap / 1048576;
            heapEl.textContent = `JS heap: ${mb.toFixed(1)} MB`;
        };

        const counters = createCounters({ callback: render });
        counters.start();

        cleanup = () => {
            counters.stop();
            hud.destroy();
        };
    },
    destroy() {
        cleanup && cleanup();
        cleanup = null;
    },
};
