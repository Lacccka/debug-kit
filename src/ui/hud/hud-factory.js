// src/ui/hud/hud-factory.js
import { storage } from "../../core/storage.js";

const POS_KEY = "debugkit:v1:positions";
const STATE_KEY = "debugkit:v1:hudstate";

export function createHudFactory({ shadowRoot, bus }) {
    const hudLayer = shadowRoot.querySelector(".dk-hud-layer");

    function clamp(val, min, max) {
        return Math.max(min, Math.min(val, max));
    }

    return function createHud(toolId, title, { width = 280, icon = "" } = {}) {
        const hud = document.createElement("div");
        hud.className = "dk-hud";
        hud.style.pointerEvents = "auto";
        hud.style.zIndex = "1";
        hud.style.left = "16px";
        hud.style.top = "16px";

        const baseWidth = Math.max(240, Math.min(320, width));
        const hdr = document.createElement("div");
        hdr.className = "hdr";
        hdr.innerHTML = `<span class="ic">${icon}</span><strong style="font-weight:600;margin-left:4px">${title}</strong>
      <span style="margin-left:auto;display:flex;gap:6px">
        <button class="btn-pin" title="Pin" style="cursor:pointer">📌</button>
        <button class="btn-set" title="Settings" style="cursor:pointer">⚙️</button>
        <button class="btn-min" title="Свернуть" style="cursor:pointer">—</button>
        <button class="btn-close" title="Закрыть" style="cursor:pointer">×</button>
      </span>`;

        const body = document.createElement("div");
        body.style.padding = "8px 10px";

        hud.appendChild(hdr);
        hud.appendChild(body);
        hudLayer.appendChild(hud);

        const enforceBounds = () => {
            let w = baseWidth;
            if (innerWidth <= 600) {
                w = Math.min(baseWidth, Math.floor(innerWidth / 3));
                hud.style.maxHeight = Math.floor(innerHeight / 3) + "px";
            } else {
                hud.style.maxHeight = "";
            }
            if (!hud.classList.contains("is-pill")) {
                hud.style.minWidth = w + "px";
                hud.style.width = w + "px";
            }
        };
        const offVpt =
            bus && bus.on ? bus.on("viewport:change", enforceBounds) : null;
        enforceBounds();

        // восстановление позиции
        const allPos = storage.getJSON(POS_KEY, {}) || {};
        const pos = allPos[toolId];
        if (pos) {
            hud.style.left = pos.left;
            hud.style.top = pos.top;
        }

        // drag
        let dragging = false,
            sx = 0,
            sy = 0,
            sl = 0,
            st = 0;
        const onDown = (e) => {
            dragging = true;
            const p = e.touches ? e.touches[0] : e;
            sx = p.clientX;
            sy = p.clientY;
            const r = hud.getBoundingClientRect();
            sl = r.left;
            st = r.top;
            hud.style.transition = "none";
            e.preventDefault();
        };
        const onMove = (e) => {
            if (!dragging) return;
            const p = e.touches ? e.touches[0] : e;
            const nx = sl + (p.clientX - sx);
            const ny = st + (p.clientY - sy);
            const maxX = innerWidth - hud.offsetWidth - 8;
            const maxY = innerHeight - hud.offsetHeight - 8;
            hud.style.left = clamp(nx, 8, Math.max(8, maxX)) + "px";
            hud.style.top = clamp(ny, 8, Math.max(8, maxY)) + "px";
        };
        const onUp = () => {
            if (!dragging) return;
            dragging = false;
            hud.style.transition = "";
            // snap к краям
            const r = hud.getBoundingClientRect();
            const snapEdge =
                r.left < innerWidth - r.right ? 8 : innerWidth - r.width - 8;
            hud.style.left = snapEdge + "px";
            // сохранить
            const cur = storage.getJSON(POS_KEY, {}) || {};
            cur[toolId] = { left: hud.style.left, top: hud.style.top };
            storage.setJSON(POS_KEY, cur);
        };
        hdr.addEventListener("mousedown", onDown);
        window.addEventListener("mousemove", onMove, { passive: false });
        window.addEventListener("mouseup", onUp);
        hdr.addEventListener("touchstart", onDown, { passive: false });
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("touchend", onUp, { passive: true });

        // кнопки
        const btnClose = hdr.querySelector(".btn-close");
        const btnMin = hdr.querySelector(".btn-min");
        const btnPin = hdr.querySelector(".btn-pin");
        const btnSet = hdr.querySelector(".btn-set");

        const allState = storage.getJSON(STATE_KEY, {}) || {};
        const saved = allState[toolId] || {};
        let pinned = !!saved.pinned;
        let minimized = !!saved.minimized;

        const saveState = () => {
            const cur = storage.getJSON(STATE_KEY, {}) || {};
            cur[toolId] = { pinned, minimized };
            storage.setJSON(STATE_KEY, cur);
            bus &&
                bus.emit &&
                bus.emit("tool:state", { id: toolId, pinned, minimized });
        };

        const setMinimized = (v) => {
            minimized = v;
            hud.classList.toggle("is-pill", minimized);
            body.style.display = minimized ? "none" : "";
            if (minimized) {
                hud.style.minWidth = "0";
            } else {
                enforceBounds();
            }
            saveState();
        };

        const togglePin = () => {
            pinned = !pinned;
            hud.classList.toggle("is-pin", pinned);
            btnPin.textContent = pinned ? "📍" : "📌";
            saveState();
        };

        const api = {
            el: hud,
            setContent(nodeOrHTML) {
                body.innerHTML = "";
                if (typeof nodeOrHTML === "string") body.innerHTML = nodeOrHTML;
                else body.appendChild(nodeOrHTML);
            },
            destroy() {
                hdr.removeEventListener("mousedown", onDown);
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("mouseup", onUp);
                hdr.removeEventListener("touchstart", onDown);
                window.removeEventListener("touchmove", onMove);
                window.removeEventListener("touchend", onUp);
                hdr.removeEventListener("click", onHdrClick);
                offVpt && offVpt();
                hud.remove();
            },
        };
        btnClose.onclick = () => api.destroy();
        btnMin.onclick = () => setMinimized(!minimized);
        btnPin.onclick = togglePin;
        btnSet.onclick = () => {
            const curTheme = storage.getItem("debugkit:v1:theme", "light");
            const next = curTheme === "light" ? "dark" : "light";
            storage.setItem("debugkit:v1:theme", next);
            bus && bus.emit && bus.emit("theme:set", next);
        };

        const onHdrClick = (e) => {
            if (hud.classList.contains("is-pill") && e.target === hdr) {
                setMinimized(false);
            }
        };
        hdr.addEventListener("click", onHdrClick);

        if (pinned) {
            hud.classList.add("is-pin");
            btnPin.textContent = "📍";
        }
        if (minimized) setMinimized(true);

        return api;
    };
}
