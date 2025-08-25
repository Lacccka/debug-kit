export const buildClamp = ({ min, max }) => {
    const minRem = (min / 16).toFixed(2);
    const vw = ((max - min) / 100).toFixed(2);
    return `clamp(${min}px, ${minRem}rem + ${vw}vw, ${max}px)`;
};
