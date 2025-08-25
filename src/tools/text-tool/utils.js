export const buildClamp = ({ min, max }) => {
    const minRem = (min / 16).toFixed(2);
    const vw = ((max - min) / 100).toFixed(2);
    return `clamp(${min}px, ${minRem}rem + ${vw}vw, ${max}px)`;
};

export const getSelector = (el) => {
    if (!el || el.nodeType !== 1) {
        return "";
    }
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1) {
        let part = node.tagName.toLowerCase();
        if (node.id) {
            part = `#${node.id}`;
            parts.unshift(part);
            break;
        }
        if (node.classList.length) {
            part += `.${node.classList[0]}`;
        }
        const parent = node.parentElement;
        if (parent) {
            const siblings = Array.from(parent.children).filter(
                (child) => child.tagName === node.tagName
            );
            if (siblings.length > 1) {
                const index = siblings.indexOf(node) + 1;
                part += `:nth-of-type(${index})`;
            }
        }
        parts.unshift(part);
        node = node.parentElement;
    }
    return parts.join(" > ");
};
