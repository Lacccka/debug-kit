import {
    exportSettings,
    importSettings,
} from "../../tools/settings-transfer/index.js";

export function renderGlobalSettings({ storage, ns, bus }) {
    const box = document.createElement("div");
    box.className = "dk-card";

    const head = document.createElement("div");
    head.className = "dk-card__head";
    head.textContent = "Глобальные настройки";
    box.appendChild(head);

    const themeField = document.createElement("div");
    themeField.className = "dk-field";
    const themeLabel = document.createElement("label");
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
    themeField.appendChild(themeLabel);
    themeField.appendChild(themeSelect);
    box.appendChild(themeField);

    const lockField = document.createElement("div");
    lockField.className = "dk-field";
    const lockLabel = document.createElement("label");
    const lockInput = document.createElement("input");
    lockInput.type = "checkbox";
    lockInput.checked = storage.getItem(ns + "panelLock", "0") === "1";
    lockLabel.appendChild(lockInput);
    lockLabel.appendChild(document.createTextNode(" Блокировка панели"));
    lockInput.onchange = () => {
        const val = lockInput.checked;
        storage.setItem(ns + "panelLock", val ? "1" : "0");
        bus && bus.emit && bus.emit("panel:lock", val);
    };
    lockField.appendChild(lockLabel);
    box.appendChild(lockField);

    const lhUrlRow = document.createElement("div");
    lhUrlRow.className = "dk-field";
    const lhUrlLabel = document.createElement("label");
    lhUrlLabel.textContent = "Lighthouse URL";
    const lhUrlInput = document.createElement("input");
    lhUrlInput.type = "text";
    lhUrlInput.value = storage.getItem(ns + "lhUrl", "https://example.com");
    lhUrlInput.oninput = () => {
        storage.setItem(ns + "lhUrl", lhUrlInput.value);
    };
    lhUrlRow.appendChild(lhUrlLabel);
    lhUrlRow.appendChild(lhUrlInput);
    box.appendChild(lhUrlRow);

    const lhStrRow = document.createElement("div");
    lhStrRow.className = "dk-field";
    const lhStrLabel = document.createElement("label");
    lhStrLabel.textContent = "Lighthouse strategy";
    const lhStrSelect = document.createElement("select");
    ["mobile", "desktop"].forEach((v) => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = v;
        lhStrSelect.appendChild(opt);
    });
    lhStrSelect.value = storage.getItem(ns + "lhStrategy", "mobile");
    lhStrSelect.onchange = () => {
        storage.setItem(ns + "lhStrategy", lhStrSelect.value);
    };
    lhStrRow.appendChild(lhStrLabel);
    lhStrRow.appendChild(lhStrSelect);
    box.appendChild(lhStrRow);

    const transferRow = document.createElement("div");
    transferRow.className = "dk-card__row";

    const btnExport = document.createElement("button");
    btnExport.textContent = "Export";
    btnExport.classList.add("btn");
    btnExport.onclick = () => {
        const data = exportSettings(ns);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "debugkit-settings.json";
        link.click();
        URL.revokeObjectURL(url);
    };

    const btnImport = document.createElement("button");
    btnImport.textContent = "Import";
    btnImport.classList.add("btn");
    btnImport.onclick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = () => {
            const file = input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                importSettings(ns, reader.result);
                location.reload();
            };
            reader.readAsText(file);
        };
        input.click();
    };

    transferRow.appendChild(btnExport);
    transferRow.appendChild(btnImport);
    box.appendChild(transferRow);

    const resetRow = document.createElement("div");
    resetRow.className = "dk-card__row";
    const btnReset = document.createElement("button");
    btnReset.textContent = "Reset";
    btnReset.classList.add("btn");
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
