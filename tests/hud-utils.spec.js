import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { highlightElement, scanOverflow } from "../src/ui/hud/hud-utils.js";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
const { document } = dom.window;
global.document = document;

// test highlightElement
const el = document.createElement("div");
document.body.appendChild(el);
let timeoutCb = null;
const realSetTimeout = global.setTimeout;
global.setTimeout = (cb, ms) => {
    timeoutCb = cb;
    return 0;
};
highlightElement(el, "dk-outline-info", 100);
assert.ok(
    document.head.querySelector("#dk-highlight-styles"),
    "highlight styles should be attached"
);
assert.equal(
    el.classList.contains("dk-outline-info"),
    true,
    "element should be highlighted"
);
assert.equal(typeof timeoutCb, "function", "callback should be scheduled");
timeoutCb();
assert.equal(
    el.classList.contains("dk-outline-info"),
    false,
    "class should be removed after timeout"
);
global.setTimeout = realSetTimeout;

// test scanOverflow
const normal = document.createElement("div");
document.body.appendChild(normal);
Object.defineProperty(normal, "scrollWidth", { get: () => 50 });
Object.defineProperty(normal, "clientWidth", { get: () => 50 });
Object.defineProperty(normal, "scrollHeight", { get: () => 20 });
Object.defineProperty(normal, "clientHeight", { get: () => 20 });

const overflow = document.createElement("div");
document.body.appendChild(overflow);
Object.defineProperty(overflow, "scrollWidth", { get: () => 150 });
Object.defineProperty(overflow, "clientWidth", { get: () => 50 });
Object.defineProperty(overflow, "scrollHeight", { get: () => 20 });
Object.defineProperty(overflow, "clientHeight", { get: () => 20 });

const highlighted = [];
const offenders = scanOverflow(document, (el, cls) => {
    highlighted.push({ el, cls });
});
assert.deepEqual(offenders, [overflow], "should return overflow elements");
assert.equal(highlighted.length, 1, "should highlight offenders");
assert.equal(
    highlighted[0].cls,
    "dk-outline-error",
    "should use overflow highlight class"
);

Object.defineProperty(document.body, "scrollWidth", { get: () => 150 });
Object.defineProperty(document.body, "clientWidth", { get: () => 50 });
const bodyOffenders = scanOverflow(document, () => {});
assert.deepEqual(
    bodyOffenders,
    [document.body, overflow],
    "should include body when body overflows"
);

console.log("hud-utils.spec.js passed");
