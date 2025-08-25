import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createBus } from "../src/core/bus.js";
import { LayoutDebugTool } from "../src/tools/layout-debug/index.js";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost",
    pretendToBeVisual: true,
});
const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;

// stub PerformanceObserver used by layout debug
global.PerformanceObserver = class {
    constructor() {}
    observe() {}
    disconnect() {}
};

// hud layer required by hud factory
const hudRoot = document.createElement("div");
hudRoot.className = "dk-hud-root";
document.body.appendChild(hudRoot);

// element without overflow
const normal = document.createElement("div");
document.body.appendChild(normal);
Object.defineProperty(normal, "scrollWidth", { get: () => 50 });
Object.defineProperty(normal, "clientWidth", { get: () => 50 });
Object.defineProperty(normal, "scrollHeight", { get: () => 20 });
Object.defineProperty(normal, "clientHeight", { get: () => 20 });

// element with overflow
const overflow = document.createElement("div");
document.body.appendChild(overflow);
Object.defineProperty(overflow, "scrollWidth", { get: () => 150 });
Object.defineProperty(overflow, "clientWidth", { get: () => 50 });
Object.defineProperty(overflow, "scrollHeight", { get: () => 20 });
Object.defineProperty(overflow, "clientHeight", { get: () => 20 });

const bus = createBus();
LayoutDebugTool.init({ shadowRoot: document, bus });

const hud = document.querySelector(".dk-hud");
const bodyEl = hud.children[1];
const view = bodyEl.firstChild;
const buttons = view.querySelectorAll("button");
const btnOverflow = buttons[1];

const realSetTimeout = global.setTimeout;
global.setTimeout = () => {};
const offenders = btnOverflow.onclick();
assert.equal(
    overflow.classList.contains("dk-outline-error-dashed"),
    true,
    "overflow element should be highlighted"
);
assert.equal(
    normal.classList.contains("dk-outline-error-dashed"),
    false,
    "non-overflow element should remain unstyled"
);
assert.deepEqual(
    offenders,
    [overflow],
    "scanOverflow should return offending elements"
);
global.setTimeout = realSetTimeout;

LayoutDebugTool.destroy();
console.log("layout-debug.spec.js passed");
