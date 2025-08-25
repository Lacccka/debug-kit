import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createBus } from "../src/core/bus.js";
import { GuardTool } from "../src/tools/guard/index.js";

// setup jsdom environment
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost",
    pretendToBeVisual: true,
});
const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;

// initial viewport values
global.innerWidth = window.innerWidth = 100;
global.innerHeight = window.innerHeight = 200;
global.visualViewport = { scale: 1 };

// hud layer required by hud factory
const hudLayer = document.createElement("div");
hudLayer.className = "dk-hud-layer";
document.body.appendChild(hudLayer);

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

// bus for events
const bus = createBus();

// initialize tool
GuardTool.init({ shadowRoot: document, bus });

const hud = document.querySelector(".dk-hud");
const bodyEl = hud.children[1];
const view = bodyEl.firstChild;
const label = view.firstChild;
const btnScan = view.querySelector("button");

// verify scanOverflow highlights offending elements
const realSetTimeout = global.setTimeout;
global.setTimeout = () => {};
btnScan.onclick();
assert.equal(
    overflow.style.outline,
    "2px dashed rgba(255,80,80,.85)",
    "overflow element should be highlighted"
);
assert.equal(
    normal.style.outline,
    "",
    "non-overflow element should remain unstyled"
);
global.setTimeout = realSetTimeout;

// verify HUD updates on viewport:change
assert.equal(
    label.textContent,
    "scale: 1.00 | viewport: 100×200",
    "initial label text"
);
innerWidth = window.innerWidth = 300;
innerHeight = window.innerHeight = 400;
visualViewport.scale = 1.5;
bus.emit("viewport:change");
assert.equal(
    label.textContent,
    "scale: 1.50 | viewport: 300×400",
    "label should update on viewport change"
);

GuardTool.destroy();
console.log("guard.spec.js passed");
