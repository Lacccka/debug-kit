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

// hud root required by hud factory
const hudRoot = document.createElement("div");
hudRoot.className = "dk-hud-root";
document.body.appendChild(hudRoot);

// bus for events
const bus = createBus();

// initialize tool
GuardTool.init({ shadowRoot: document, bus });

const hud = document.querySelector(".dk-hud");
const bodyEl = hud.children[1];
const view = bodyEl.firstChild;
const label = view.firstChild;
const changeLabel = view.lastChild;

// verify HUD updates on viewport:change and records zoom changes
assert.equal(
    label.textContent,
    "scale: 1.00 | viewport: 100×200",
    "initial label text"
);
assert.equal(changeLabel.textContent, "", "no zoom changes initially");
innerWidth = window.innerWidth = 300;
innerHeight = window.innerHeight = 400;
visualViewport.scale = 1.5;
bus.emit("viewport:change");
assert.equal(
    label.textContent,
    "scale: 1.50 | viewport: 300×400",
    "label should update on viewport change"
);
assert.equal(
    changeLabel.textContent,
    "zoom changed: 1.00 → 1.50",
    "should report zoom change"
);

GuardTool.destroy();
console.log("guard.spec.js passed");
