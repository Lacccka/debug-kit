export const highlightElement = (el, cls, duration = 1500) => {
    el.classList.add(cls);
    setTimeout(() => {
        el.classList.remove(cls);
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
            highlight(el, "dk-outline-error-dashed");
        }
    });
    return offenders;
};
