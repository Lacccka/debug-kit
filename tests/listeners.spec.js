import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { setupListeners } from "../src/core/listeners.js";

const dom = new JSDOM("<!DOCTYPE html><html></html>", {
    pretendToBeVisual: true,
});
const { window } = dom;
global.window = window;
global.document = window.document;
global.innerWidth = window.innerWidth;
global.innerHeight = window.innerHeight;

window.matchMedia = () => ({ matches: false, addEventListener: () => {} });
global.matchMedia = window.matchMedia;
class ResizeObserver {
    constructor(cb) {
        this.cb = cb;
    }
    observe() {
        this.cb();
    }
}
global.ResizeObserver = ResizeObserver;

const vvHandlers = {};
window.visualViewport = {
    scale: 1,
    addEventListener: (t, h) => {
        vvHandlers[t] = h;
    },
    dispatchEvent: (e) => {
        vvHandlers[e.type]?.(e);
    },
};
global.visualViewport = window.visualViewport;

const events = [];
const bus = {
    emit: (type, data) => {
        events.push({ type, data });
    },
    on: () => {},
};

setupListeners({ bus });

assert.ok(
    events.some((e) => e.type === "viewport:change"),
    "initial viewport emit"
);
assert.ok(
    events.some((e) => e.type === "zoom:change"),
    "initial zoom emit"
);
assert.ok(
    events.some((e) => e.type === "scrollbar:change"),
    "initial scrollbar emit"
);

events.length = 0;
window.dispatchEvent(new window.Event("resize"));
assert.ok(
    events.some((e) => e.type === "viewport:change"),
    "resize should emit viewport"
);

events.length = 0;
window.visualViewport.scale = 2;
window.visualViewport.dispatchEvent(new window.Event("resize"));
assert.ok(
    events.some((e) => e.type === "zoom:change"),
    "visualViewport resize should emit zoom"
);

console.log("listeners.spec.js passed");
