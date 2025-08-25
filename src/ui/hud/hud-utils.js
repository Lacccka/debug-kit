export const highlightElement = (el, style, duration = 1500) => {
    const prev = el.style.outline;
    el.style.outline = style;
    setTimeout(() => {
        el.style.outline = prev;
    }, duration);
};

export const scanOverflow = (root = document, highlight = highlightElement) => {
    const offenders = [];
    root.querySelectorAll("body *").forEach((el) => {
        const sw = el.scrollWidth;
        const cw = el.clientWidth;
        const sh = el.scrollHeight;
        const ch = el.clientHeight;
        if (sw > cw + 1 || sh > ch + 1) {
            offenders.push(el);
            highlight(el, "2px dashed rgba(255,80,80,.85)");
        }
    });
    return offenders;
};
