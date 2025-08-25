import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { setupGestures } from "../src/core/gestures.js";

const dom = new JSDOM("<!DOCTYPE html><html></html>", {
    pretendToBeVisual: true,
});
const { window } = dom;
global.window = window;
global.document = window.document;
global.location = window.location;
global.innerWidth = window.innerWidth;
global.innerHeight = window.innerHeight;

let toggled = 0;
const togglePanel = () => {
    toggled++;
};

setupGestures({ bus: { on: () => {}, emit: () => {} }, togglePanel });

window.dispatchEvent(
    new window.KeyboardEvent("keydown", { altKey: true, code: "KeyD" })
);
assert.equal(toggled, 1, "Alt+D should toggle panel");

const bottomRight = () =>
    new window.MouseEvent("pointerdown", {
        clientX: window.innerWidth - 1,
        clientY: window.innerHeight - 1,
    });
window.dispatchEvent(bottomRight());
window.dispatchEvent(bottomRight());
window.dispatchEvent(bottomRight());
assert.equal(toggled, 2, "Triple tap should toggle panel");

window.dispatchEvent(
    new window.MouseEvent("pointerdown", { clientX: 0, clientY: 0 })
);
await new Promise((r) => setTimeout(r, 700));
assert.equal(toggled, 3, "Long tap should toggle panel");

console.log("gestures.spec.js passed");
