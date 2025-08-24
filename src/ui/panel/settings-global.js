export function renderGlobalSettings({ storage, ns }) {
    const card = document.createElement("div");
    card.style.padding = "10px";
    const h = document.createElement("h3");
    h.textContent = "Глобальные настройки";
    const btnReset = document.createElement("button");
    btnReset.textContent = "Reset";
    btnReset.onclick = () => {
        Object.keys(localStorage).forEach((k) => {
            if (k.startsWith(ns)) localStorage.removeItem(k);
        });
        location.reload();
    };
    card.appendChild(h);
    card.appendChild(btnReset);
    return card;
}
