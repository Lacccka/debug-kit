import assert from "node:assert/strict";
import {
    columnGradient,
    baselineGradient,
    buildOverlay,
} from "../src/tools/grid-overlay/overlays.js";

const color = "rgba(1,2,3,0.5)";

const col = columnGradient({ columns: 3, gutter: 10, color });
assert.equal(
    col,
    "repeating-linear-gradient(to right, rgba(1,2,3,0.5), rgba(1,2,3,0.5) calc((100% - 20px) / 3), transparent calc((100% - 20px) / 3), transparent calc((100% - 20px) / 3 + 10px))",
    "columnGradient should build correct pattern"
);

const base = baselineGradient({ baseline: 8, color });
assert.equal(
    base,
    "repeating-linear-gradient(to bottom, rgba(1,2,3,0.5), rgba(1,2,3,0.5) 1px, transparent 1px, transparent 8px)",
    "baselineGradient should build correct pattern"
);

const combo = buildOverlay({
    columns: 2,
    gutter: 10,
    baseline: 5,
    color,
    showColumns: true,
    showBaseline: true,
});
assert.equal(
    combo,
    `${columnGradient({ columns: 2, gutter: 10, color })}, ${baselineGradient({
        baseline: 5,
        color,
    })}`,
    "buildOverlay should combine layers"
);

console.log("grid-overlay.spec.js passed");
