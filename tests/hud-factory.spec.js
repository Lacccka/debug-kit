import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createHudFactory } from "../src/ui/hud/hud-factory.js";

// setup jsdom environment
const dom = new JSDOM(
    '<!DOCTYPE html><html><body><div class="dk-hud-root"></div></body></html>',
    { url: "http://localhost", pretendToBeVisual: true }
);
const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
global.innerWidth = window.innerWidth = 500;
global.innerHeight = window.innerHeight = 500;

// simple bus stub
const events = [];
const bus = {
    on: () => {},
    emit: (type, data) => {
        events.push({ type, data });
    },
};

const NS = "debugkit:v1:";
const hudFactory = createHudFactory({ shadowRoot: document, bus, ns: NS });

// --- position saving and restoring ---
const hud = hudFactory("pos", "Position");
const hdr = hud.el.querySelector(".hdr");

Object.defineProperty(hud.el, "offsetWidth", { get: () => 100 });
Object.defineProperty(hud.el, "offsetHeight", { get: () => 100 });
hud.el.getBoundingClientRect = () => {
    const l = parseFloat(hud.el.style.left) || 0;
    const t = parseFloat(hud.el.style.top) || 0;
    return {
        left: l,
        top: t,
        width: 100,
        height: 100,
        right: l + 100,
        bottom: t + 100,
    };
};

hdr.dispatchEvent(
    new window.MouseEvent("mousedown", {
        clientX: 0,
        clientY: 0,
        bubbles: true,
    })
);
window.dispatchEvent(
    new window.MouseEvent("mousemove", {
        clientX: 200,
        clientY: 150,
        bubbles: true,
    })
);
window.dispatchEvent(new window.MouseEvent("mouseup", { bubbles: true }));

const expectedLeft = innerWidth - 100 - 8;
const expectedTop = hud.el.style.top;
const pos = JSON.parse(localStorage.getItem(NS + "positions"));
assert.deepEqual(
    pos.pos,
    { left: `${expectedLeft}px`, top: expectedTop },
    "should save position after drag"
);

hud.destroy();
const hudRestored = hudFactory("pos", "Position");
assert.equal(
    hudRestored.el.style.left,
    `${expectedLeft}px`,
    "should restore left position"
);
assert.equal(
    hudRestored.el.style.top,
    expectedTop,
    "should restore top position"
);

// --- minimized and pinned states ---
localStorage.clear();
const hudState = hudFactory("state", "State");
const btnMin = hudState.el.querySelector(".btn-min");
const btnPin = hudState.el.querySelector(".btn-pin");

btnMin.click();
let state = JSON.parse(localStorage.getItem(NS + "hudstate"));
assert.ok(
    hudState.el.classList.contains("is-pill"),
    "should add is-pill on minimize"
);
assert.deepEqual(
    state.state,
    { pinned: false, minimized: true },
    "minimize saved to storage"
);

btnMin.click();
state = JSON.parse(localStorage.getItem(NS + "hudstate"));
assert.equal(
    hudState.el.classList.contains("is-pill"),
    false,
    "should remove is-pill on restore"
);
assert.deepEqual(
    state.state,
    { pinned: false, minimized: false },
    "restore saved to storage"
);

btnPin.click();
state = JSON.parse(localStorage.getItem(NS + "hudstate"));
assert.ok(
    hudState.el.classList.contains("is-pin"),
    "should add is-pin when pinned"
);
assert.deepEqual(
    state.state,
    { pinned: true, minimized: false },
    "pin saved to storage"
);

btnPin.click();
state = JSON.parse(localStorage.getItem(NS + "hudstate"));
assert.equal(
    hudState.el.classList.contains("is-pin"),
    false,
    "should remove is-pin when unpinned"
);
assert.deepEqual(
    state.state,
    { pinned: false, minimized: false },
    "unpin saved to storage"
);

console.log("hud-factory.spec.js passed");
