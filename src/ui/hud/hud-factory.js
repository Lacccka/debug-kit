// src/ui/hud/hud-factory.js
import { storage } from "../../core/storage.js";

const POS_KEY = "debugkit:v1:positions";

export function createHudFactory({ shadowRoot }) {
    const hudLayer = shadowRoot.querySelector(".dk-hud-layer");

    function clamp(val, min, max) {
        return Math.max(min, Math.min(val, max));
    }

    return function createHud(toolId, title, { width = 280 } = {}) {
        const hud = document.createElement("div");
        hud.className = "dk-hud";
        hud.style.pointerEvents = "auto";
        hud.style.zIndex = "1";
        hud.style.minWidth = Math.max(240, Math.min(320, width)) + "px";
        hud.style.left = "16px";
        hud.style.top = "16px";

        const hdr = document.createElement("div");
        hdr.className = "hdr";
        hdr.innerHTML = `<strong style="font-weight:600">${title}</strong>
      <span style="margin-left:auto;display:flex;gap:6px">
        <button class="btn-min" title="Свернуть" style="cursor:pointer">—</button>
        <button class="btn-close" title="Закрыть" style="cursor:pointer">×</button>
      </span>`;

        const body = document.createElement("div");
        body.style.padding = "8px 10px";

        hud.appendChild(hdr);
        hud.appendChild(body);
        hudLayer.appendChild(hud);

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
        hdr.querySelector(".btn-close").onclick = () => hud.remove();
        hdr.querySelector(".btn-min").onclick = () => {
            const minimized = hud.classList.toggle("is-min");
            body.style.display = minimized ? "none" : "";
        };

        return {
            el: hud,
            setContent(nodeOrHTML) {
                body.innerHTML = "";
                if (typeof nodeOrHTML === "string") body.innerHTML = nodeOrHTML;
                else body.appendChild(nodeOrHTML);
            },
            destroy() {
                hud.remove();
            },
        };
    };
}
