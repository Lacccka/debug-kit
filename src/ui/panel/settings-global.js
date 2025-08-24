export function renderGlobalSettings({ storage, ns, bus }) {
    const box = document.createElement("div");
    box.className = "dk-card";

    const head = document.createElement("div");
    head.className = "dk-card__head";
    head.textContent = "Глобальные настройки";
    box.appendChild(head);

    const themeRow = document.createElement("div");
    themeRow.className = "dk-card__row";
    const themeLabel = document.createElement("span");
    themeLabel.textContent = "Тема";
    const themeSelect = document.createElement("select");
    ["auto", "light", "dark"].forEach((v) => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = v;
        themeSelect.appendChild(opt);
    });
    const currentTheme = storage.getItem(ns + "theme", "auto");
    themeSelect.value = currentTheme;
    themeSelect.onchange = () => {
        const val = themeSelect.value;
        if (val === "auto") {
            storage.remove(ns + "theme");
            const sys = matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
            bus && bus.emit && bus.emit("theme:set", sys);
        } else {
            storage.setItem(ns + "theme", val);
            bus && bus.emit && bus.emit("theme:set", val);
        }
    };
    themeRow.appendChild(themeLabel);
    themeRow.appendChild(themeSelect);
    box.appendChild(themeRow);

    const lockRow = document.createElement("div");
    lockRow.className = "dk-card__row";
    const lockLabel = document.createElement("span");
    lockLabel.textContent = "Блокировка панели";
    const lockCtrl = document.createElement("label");
    lockCtrl.className = "dk-switch";
    const lockInput = document.createElement("input");
    lockInput.type = "checkbox";
    lockInput.checked = storage.getItem(ns + "panelLock", "0") === "1";
    const lockSlider = document.createElement("span");
    lockSlider.className = "slider";
    lockCtrl.appendChild(lockInput);
    lockCtrl.appendChild(lockSlider);
    lockInput.onchange = () => {
        const val = lockInput.checked;
        storage.setItem(ns + "panelLock", val ? "1" : "0");
        bus && bus.emit && bus.emit("panel:lock", val);
    };
    lockRow.appendChild(lockLabel);
    lockRow.appendChild(lockCtrl);
    box.appendChild(lockRow);

    const resetRow = document.createElement("div");
    resetRow.className = "dk-card__row";
    const btnReset = document.createElement("button");
    btnReset.textContent = "Reset";
    btnReset.onclick = () => {
        Object.keys(localStorage).forEach((k) => {
            if (k.startsWith(ns)) localStorage.removeItem(k);
        });
        location.reload();
    };
    resetRow.appendChild(btnReset);
    box.appendChild(resetRow);

    return box;
}
