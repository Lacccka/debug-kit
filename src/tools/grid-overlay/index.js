// tools/grid-overlay/index.js — сетка колонок и baseline (шаг 7).
import { createHudFactory } from "../../ui/hud/hud-factory.js";
import { buildOverlay } from "./overlays.js";

let cleanup = null;

export const GridOverlayTool = {
    id: "grid",
    name: "Grid Overlay",
    icon: "📐",
    init(ctx) {
        const state = {
            columns: ctx.storage.get("columns", 12),
            gutter: ctx.storage.get("gutter", 20),
            baseline: ctx.storage.get("baseline", 8),
            showColumns: ctx.storage.get("showColumns", true),
            showBaseline: ctx.storage.get("showBaseline", false),
        };

        const overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "fixed",
            inset: "0",
            pointerEvents: "none",
            zIndex: "1",
        });
        ctx.shadowRoot.appendChild(overlay);

        const apply = () => {
            overlay.style.backgroundImage = buildOverlay({
                columns: state.columns,
                gutter: state.gutter,
                baseline: state.baseline,
                showColumns: state.showColumns,
                showBaseline: state.showBaseline,
            });
            ctx.storage.set("columns", state.columns);
            ctx.storage.set("gutter", state.gutter);
            ctx.storage.set("baseline", state.baseline);
            ctx.storage.set("showColumns", state.showColumns);
            ctx.storage.set("showBaseline", state.showBaseline);
        };

        const hudFactory = createHudFactory({
            shadowRoot: ctx.shadowRoot,
            bus: ctx.bus,
            ns: ctx.ns,
        });
        const hud = hudFactory("grid", "Grid Overlay", {
            icon: GridOverlayTool.icon,
            width: 260,
        });

        const view = document.createElement("div");

        const addInput = (labelText, value, min, key) => {
            const label = document.createElement("label");
            label.textContent = labelText + ": ";
            const input = document.createElement("input");
            input.type = "number";
            input.min = String(min);
            input.value = String(value);
            input.style.width = "64px";
            input.oninput = () => {
                const v = parseInt(input.value, 10);
                state[key] = isNaN(v) ? state[key] : v;
                apply();
            };
            label.appendChild(input);
            view.appendChild(label);
            view.appendChild(document.createElement("br"));
        };

        addInput("Columns", state.columns, 1, "columns");
        addInput("Gutter", state.gutter, 0, "gutter");
        addInput("Baseline", state.baseline, 1, "baseline");

        const cbCols = document.createElement("label");
        const chkCols = document.createElement("input");
        chkCols.type = "checkbox";
        chkCols.checked = state.showColumns;
        chkCols.onchange = () => {
            state.showColumns = chkCols.checked;
            apply();
        };
        cbCols.appendChild(chkCols);
        cbCols.appendChild(document.createTextNode(" Columns"));
        view.appendChild(cbCols);
        view.appendChild(document.createElement("br"));

        const cbBase = document.createElement("label");
        const chkBase = document.createElement("input");
        chkBase.type = "checkbox";
        chkBase.checked = state.showBaseline;
        chkBase.onchange = () => {
            state.showBaseline = chkBase.checked;
            apply();
        };
        cbBase.appendChild(chkBase);
        cbBase.appendChild(document.createTextNode(" Baseline"));
        view.appendChild(cbBase);

        hud.setContent(view);
        apply();

        cleanup = () => {
            overlay.remove();
            hud.destroy();
        };
    },
    destroy() {
        cleanup && cleanup();
        cleanup = null;
    },
};
