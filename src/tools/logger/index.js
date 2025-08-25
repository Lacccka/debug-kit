// tools/logger/index.js — UI, фильтры, пауза (шаг 9).
import { createHudFactory } from "../../ui/hud/hud-factory.js";
import { interceptErrors } from "./errors.js";
import { interceptNetwork } from "./network.js";

let cleanup = null;

export const LoggerTool = {
    id: "logger",
    name: "Logger",
    icon: "📝",
    init(ctx) {
        const state = {
            paused: ctx.storage.get("logPaused", false),
            showErrors: ctx.storage.get("logShowErrors", true),
            showRequests: ctx.storage.get("logShowRequests", true),
            logs: ctx.storage.getJSON("logItems", []) || [],
        };

        const hudFactory = createHudFactory({
            shadowRoot: ctx.shadowRoot,
            bus: ctx.bus,
            ns: ctx.ns,
        });
        const hud = hudFactory("logger", "Logger", {
            icon: LoggerTool.icon,
            width: 320,
        });

        const view = document.createElement("div");
        const controls = document.createElement("div");
        controls.classList.add("dk-mb-2");

        const btnPause = document.createElement("button");
        const updatePause = () => {
            btnPause.textContent = state.paused ? "Resume" : "Pause";
            ctx.storage.set("logPaused", state.paused);
        };
        btnPause.onclick = () => {
            state.paused = !state.paused;
            updatePause();
        };
        updatePause();
        controls.appendChild(btnPause);

        const addCheck = (labelText, key) => {
            const label = document.createElement("label");
            label.classList.add("dk-mb-2");
            const chk = document.createElement("input");
            chk.type = "checkbox";
            chk.checked = state[key];
            chk.onchange = () => {
                state[key] = chk.checked;
                ctx.storage.set(
                    key === "showErrors" ? "logShowErrors" : "logShowRequests",
                    state[key]
                );
                render();
            };
            label.appendChild(chk);
            label.appendChild(document.createTextNode(" " + labelText));
            controls.appendChild(label);
        };
        addCheck("Errors", "showErrors");
        addCheck("Requests", "showRequests");

        view.appendChild(controls);

        const list = document.createElement("div");
        list.classList.add("dk-scroll-list");
        view.appendChild(list);

        const render = () => {
            list.innerHTML = "";
            state.logs
                .filter(
                    (l) =>
                        (l.type === "error" && state.showErrors) ||
                        (l.type === "request" && state.showRequests)
                )
                .forEach((l) => {
                    const item = document.createElement("div");
                    if (l.type === "error") {
                        item.textContent = `❌ ${l.message}`;
                    } else {
                        item.textContent = `🌐 ${l.method} ${l.url} ${
                            l.status || l.error
                        }`;
                    }
                    list.appendChild(item);
                });
            ctx.storage.setJSON("logItems", state.logs.slice(-100));
        };
        render();

        const addLog = (log) => {
            if (state.paused) return;
            state.logs.push(log);
            render();
        };

        const stopErr = interceptErrors(addLog);
        const stopNet = interceptNetwork(addLog);
        hud.setContent(view);

        cleanup = () => {
            stopErr();
            stopNet();
            hud.destroy();
        };
    },
    destroy() {
        cleanup && cleanup();
        cleanup = null;
    },
};
