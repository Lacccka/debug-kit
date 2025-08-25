// tools/grid-overlay/overlays.js — CSS-gradients для оверлея.

const DEFAULT_COLOR = "rgba(0,128,255,0.25)";

/**
 * Возвращает градиент для колонок.
 * @param {Object} opts - параметры.
 * @param {number} opts.columns - количество колонок.
 * @param {number} opts.gutter - размер gutter в пикселях.
 * @param {string} [opts.color] - цвет заливки.
 * @returns {string}
 */
export const columnGradient = ({
    columns = 12,
    gutter = 20,
    color = DEFAULT_COLOR,
} = {}) => {
    const totalGutter = (columns - 1) * gutter;
    const base = `(100% - ${totalGutter}px) / ${columns}`;
    const colWidth = `calc(${base})`;
    return `repeating-linear-gradient(to right, ${color}, ${color} ${colWidth}, transparent ${colWidth}, transparent calc(${base} + ${gutter}px))`;
};

/**
 * Возвращает градиент для baseline.
 * @param {Object} opts - параметры.
 * @param {number} opts.baseline - шаг сетки в пикселях.
 * @param {string} [opts.color] - цвет линий.
 * @returns {string}
 */
export const baselineGradient = ({
    baseline = 8,
    color = DEFAULT_COLOR,
} = {}) =>
    `repeating-linear-gradient(to bottom, ${color}, ${color} 1px, transparent 1px, transparent ${baseline}px)`;

/**
 * Формирует комбинированный фон из колонок и baseline.
 * @param {Object} opts - параметры.
 * @param {number} [opts.columns]
 * @param {number} [opts.gutter]
 * @param {number} [opts.baseline]
 * @param {boolean} [opts.showColumns]
 * @param {boolean} [opts.showBaseline]
 * @param {string} [opts.color]
 * @returns {string}
 */
export const buildOverlay = ({
    columns = 12,
    gutter = 20,
    baseline = 8,
    showColumns = true,
    showBaseline = true,
    color = DEFAULT_COLOR,
} = {}) => {
    const layers = [];
    if (showColumns) layers.push(columnGradient({ columns, gutter, color }));
    if (showBaseline) layers.push(baselineGradient({ baseline, color }));
    return layers.join(", ");
};
