import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createBus } from "../src/core/bus.js";
import { InspectorTool } from "../src/tools/inspector/index.js";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost",
    pretendToBeVisual: true,
});
const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;

const hudLayer = document.createElement("div");
hudLayer.className = "dk-hud-layer";
document.body.appendChild(hudLayer);

const target = document.createElement("div");
document.body.appendChild(target);
Object.defineProperty(target, "getBoundingClientRect", {
    value: () => ({ width: 100, height: 50 }),
});

const bus = createBus();
InspectorTool.init({ shadowRoot: document, bus });

target.dispatchEvent(new window.MouseEvent("mousemove", { bubbles: true }));

assert.equal(
    target.classList.contains("dk-outline-error"),
    true,
    "element should be highlighted"
);

const hud = document.querySelector(".dk-hud");
const body = hud.children[1];
const info = body.firstChild;
assert.equal(info.textContent, "div 100×50", "HUD should display element info");

InspectorTool.destroy();
console.log("inspector.spec.js passed");
