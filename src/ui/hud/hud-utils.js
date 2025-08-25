// Ensure outline highlight styles are available globally.
const attachHighlightStyles = () => {
    const id = "dk-highlight-styles";
    if (document.getElementById(id)) {
        return;
    }
    const style = document.createElement("style");
    style.id = id;
    style.textContent =
        ".dk-outline-info{outline:2px solid rgba(50,150,255,0.9)!important;}" +
        ".dk-outline-error{outline:2px solid rgba(255,80,80,0.85)!important;}" +
        ".dk-outline-error-dashed{outline:2px dashed rgba(255,80,80,0.85)!important;}";
    document.head.appendChild(style);
};

export const highlightElement = (el, cls, duration = 1500) => {
    attachHighlightStyles();
    el.classList.add(cls);
    setTimeout(() => {
        el.classList.remove(cls);
    }, duration);
};

export const scanOverflow = (root = document, highlight = highlightElement) => {
    const offenders = [];
    const rootEl = root === document ? document.body : root;
    if (!rootEl) {
        return offenders;
    }
    [rootEl, ...rootEl.querySelectorAll("*")].forEach((el) => {
        const sw = el.scrollWidth;
        const cw = el.clientWidth;
        const sh = el.scrollHeight;
        const ch = el.clientHeight;
        if (sw > cw + 1 || sh > ch + 1) {
            offenders.push(el);
            highlight(el, "dk-outline-error");
        }
    });
    return offenders;
};
