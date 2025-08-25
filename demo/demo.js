// Никаких «багов в коде»: только хелперы для отладки вёрстки

// Кнопка: вкл/выкл подсветку границ, чтобы легче видеть overflow
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("toggle-outlines");
    if (!btn) return;

    let on = false;
    btn.addEventListener("click", () => {
        on = !on;
        document.body.classList.toggle("debug-outline", on);
        btn.textContent = on ? "Скрыть границы" : "Показать границы";
    });
});
