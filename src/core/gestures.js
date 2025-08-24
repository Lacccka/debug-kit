export function setupGestures({ bus, togglePanel }) {
    // Тогглер (кнопка) отрисует панель сам компонент panel
    // Alt+D
    window.addEventListener(
        "keydown",
        (e) => {
            if (
                e.altKey &&
                e.code === "KeyD" &&
                !/input|textarea/i.test(
                    (document.activeElement || {}).tagName || ""
                )
            ) {
                e.preventDefault();
                togglePanel();
            }
        },
        { passive: false }
    );

    // URL #debug
    if (location.hash.includes("debug")) togglePanel();

    // mobile gestures
    const EDGE = 50;
    const TAP_DELAY = 350;
    const HOTSPOT = 8;
    let tapCount = 0;
    let lastTap = 0;
    let longTapTimer;

    window.addEventListener(
        "pointerdown",
        (e) => {
            const { clientX: x, clientY: y } = e;
            const now = Date.now();

            // triple-tap bottom-right corner
            if (x > innerWidth - EDGE && y > innerHeight - EDGE) {
                tapCount = now - lastTap < TAP_DELAY ? tapCount + 1 : 1;
                lastTap = now;
                if (tapCount === 3) {
                    togglePanel();
                    tapCount = 0;
                }
            }

            // long-tap hotspot at top-left
            if (x < HOTSPOT && y < HOTSPOT) {
                longTapTimer = setTimeout(() => {
                    togglePanel();
                }, 600);
            }
        },
        { passive: true }
    );

    const cancelLongTap = () => {
        clearTimeout(longTapTimer);
    };

    window.addEventListener("pointerup", cancelLongTap, { passive: true });
    window.addEventListener(
        "pointermove",
        (e) => {
            if (e.clientX >= HOTSPOT || e.clientY >= HOTSPOT) {
                cancelLongTap();
            }
        },
        { passive: true }
    );
    window.addEventListener("pointercancel", cancelLongTap, { passive: true });
}
