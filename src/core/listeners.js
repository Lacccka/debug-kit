export function setupListeners({ bus }) {
    let vpt = {
        w: innerWidth,
        h: innerHeight,
        scale: window.visualViewport ? visualViewport.scale : 1,
    };
    let lastScale = vpt.scale;

    const emitViewport = () => bus.emit("viewport:change", { ...vpt });
    const emitZoom = () => bus.emit("zoom:change", vpt.scale);

    let scrollbar = {
        x:
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
        y:
            document.documentElement.scrollHeight >
            document.documentElement.clientHeight,
    };
    const emitScrollbar = () => bus.emit("scrollbar:change", { ...scrollbar });

    const checkScrollbars = () => {
        const doc = document.documentElement;
        const s = {
            x: doc.scrollWidth > doc.clientWidth,
            y: doc.scrollHeight > doc.clientHeight,
        };
        if (s.x !== scrollbar.x || s.y !== scrollbar.y) {
            scrollbar = s;
            emitScrollbar();
        }
    };

    const onV = () => {
        vpt = {
            w: innerWidth,
            h: innerHeight,
            scale: window.visualViewport ? visualViewport.scale : 1,
        };
        emitViewport();
        if (vpt.scale !== lastScale) {
            lastScale = vpt.scale;
            emitZoom();
        }
        checkScrollbars();
    };

    window.addEventListener("resize", onV, { passive: true });
    if (window.visualViewport) {
        visualViewport.addEventListener("resize", onV, { passive: true });
        visualViewport.addEventListener("scroll", onV, { passive: true });
    }
    const ro = new ResizeObserver(() => checkScrollbars());
    ro.observe(document.documentElement);

    const mql = matchMedia("(prefers-color-scheme: dark)");
    let theme = mql.matches ? "dark" : "light";
    const emitTheme = () => bus.emit("theme:change", theme);
    mql.addEventListener("change", (e) => {
        theme = e.matches ? "dark" : "light";
        emitTheme();
    });
    bus.on("theme:set", (t) => {
        theme = t;
        emitTheme();
    });

    emitViewport();
    emitZoom();
    emitScrollbar();
    emitTheme();
}
