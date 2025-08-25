import assert from "node:assert/strict";
import { buildClamp } from "../src/tools/text-tool/utils.js";

const clamp = buildClamp({ min: 12, max: 24 });
assert.equal(
    clamp,
    "clamp(12px, 0.75rem + 0.12vw, 24px)",
    "buildClamp should create clamp expression"
);

console.log("text-tool.spec.js passed");
