export const highlightElement = (el, cls, duration = 1500) => {
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
