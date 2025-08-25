import { createHudFactory } from "../../ui/hud/hud-factory.js";
import { buildClamp, getSelector } from "./utils.js";

let cleanup = null;

export const TextTool = {
    id: "text",
    name: "Text Tool",
    icon: "🔤",
    init(ctx) {
        const state = {
            selector: ctx.storage.get("txtSelector", "body"),
            text: ctx.storage.get("txtContent", ""),
            min: ctx.storage.get("txtMin", 16),
            max: ctx.storage.get("txtMax", 32),
        };

        let pickCleanup = null;

        const apply = () => {
            const el = document.querySelector(state.selector);
            if (!el) return;
            if (state.text) {
                el.textContent = state.text;
            }
            el.style.fontSize = buildClamp({ min: state.min, max: state.max });
            ctx.storage.set("txtSelector", state.selector);
            ctx.storage.set("txtContent", state.text);
            ctx.storage.set("txtMin", state.min);
            ctx.storage.set("txtMax", state.max);
        };

        const startPick = () => {
            if (pickCleanup) {
                return;
            }
            let highlighted = null;
            let prevOutline = "";
            const onMove = (e) => {
                const el = e.target;
                if (!(el && el.nodeType === 1) || el === highlighted) {
                    return;
                }
                if (highlighted) {
                    highlighted.classList.remove("dk-outline-info");
                    highlighted.style.outline = prevOutline;
                }
                highlighted = el;
                prevOutline = el.style.outline;
                el.classList.add("dk-outline-info");
            };
            const finish = () => {
                document.removeEventListener("mousemove", onMove);
                document.removeEventListener("click", onClick, true);
                document.removeEventListener("keydown", onKey, true);
                if (highlighted) {
                    highlighted.classList.remove("dk-outline-info");
                    highlighted.style.outline = prevOutline;
                }
                pickCleanup = null;
            };
            const onClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (highlighted) {
                    state.selector = getSelector(highlighted);
                    selectorInput.value = state.selector;
                    apply();
                }
                finish();
            };
            const onKey = (e) => {
                if (e.key === "Escape") {
                    finish();
                }
            };
            document.addEventListener("mousemove", onMove);
            document.addEventListener("click", onClick, true);
            document.addEventListener("keydown", onKey, true);
            pickCleanup = finish;
        };

        const hudFactory = createHudFactory({
            shadowRoot: ctx.shadowRoot,
            bus: ctx.bus,
            ns: ctx.ns,
        });
        const hud = hudFactory("text", "Text Tool", {
            icon: TextTool.icon,
            width: 320,
        });

        const view = document.createElement("div");

        const selectorField = document.createElement("div");
        selectorField.className = "dk-field";
        const selectorLabel = document.createElement("label");
        selectorLabel.textContent = "Selector";
        const selectorInput = document.createElement("input");
        selectorInput.type = "text";
        selectorInput.value = state.selector;
        selectorInput.oninput = () => {
            state.selector = selectorInput.value;
            apply();
        };
        selectorField.appendChild(selectorLabel);
        selectorField.appendChild(selectorInput);
        const pickBtn = document.createElement("button");
        pickBtn.type = "button";
        pickBtn.textContent = "Pick";
        pickBtn.onclick = startPick;
        selectorField.appendChild(pickBtn);
        view.appendChild(selectorField);

        const textField = document.createElement("div");
        textField.className = "dk-field";
        const textLabel = document.createElement("label");
        textLabel.textContent = "Text";
        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.value = state.text;
        textInput.oninput = () => {
            state.text = textInput.value;
            apply();
        };
        textField.appendChild(textLabel);
        textField.appendChild(textInput);
        view.appendChild(textField);

        const addNumber = (labelText, key) => {
            const field = document.createElement("div");
            field.className = "dk-field";
            const label = document.createElement("label");
            label.textContent = labelText;
            const input = document.createElement("input");
            input.type = "number";
            input.min = "1";
            input.value = String(state[key]);
            input.oninput = () => {
                const v = parseInt(input.value, 10);
                state[key] = isNaN(v) ? state[key] : v;
                apply();
            };
            field.appendChild(label);
            field.appendChild(input);
            view.appendChild(field);
        };

        addNumber("Min Size", "min");
        addNumber("Max Size", "max");

        hud.setContent(view);
        apply();

        cleanup = () => {
            pickCleanup && pickCleanup();
            hud.destroy();
        };
    },
    destroy() {
        cleanup && cleanup();
        cleanup = null;
    },
};
