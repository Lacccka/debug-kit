import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createPanel } from "../src/ui/panel/panel.js";
import { storage } from "../src/core/storage.js";

const dom = new JSDOM(
    '<!DOCTYPE html><html><body><div class="dk-root"></div><div class="dk-panel"></div></body></html>',
    { url: "http://localhost", pretendToBeVisual: true }
);
const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
window.matchMedia = () => ({ matches: false, addEventListener: () => {} });
global.matchMedia = window.matchMedia;
global.CustomEvent = window.CustomEvent;

const registry = {
    getAll: () => [
        { id: "alpha", name: "Alpha", icon: "A", enabled: true },
        { id: "beta", name: "Beta", icon: "B", enabled: false },
    ],
    enableTool: () => {},
    disableTool: () => {},
};

const events = [];
const handlers = {};
const bus = {
    on: (type, fn) => {
        (handlers[type] ||= []).push(fn);
    },
    emit: (type, data) => {
        events.push({ type, data });
        (handlers[type] || []).forEach((fn) => fn(data));
    },
};

const ns = "spec:";
const panel = createPanel({ bus, registry, storage, shadowRoot: document, ns });

// --- search functionality ---
const grid = document.querySelector(".dk-grid");
const input = document.querySelector(".dk-panel__header .srch");
assert.equal(grid.children.length, 2, "should list all tools");
input.value = "beta";
input.dispatchEvent(new window.Event("input", { bubbles: true }));
assert.equal(grid.children.length, 1, "search should filter tools");
assert.ok(grid.textContent.includes("Beta"), "filtered tool should be Beta");

// --- global settings ---
const themeSelect = document.querySelector(".dk-panel select");
themeSelect.value = "dark";
themeSelect.dispatchEvent(new window.Event("change", { bubbles: true }));
assert.equal(
    localStorage.getItem(ns + "theme"),
    "dark",
    "theme selection stored in localStorage"
);
assert.ok(
    events.some((e) => e.type === "theme:set" && e.data === "dark"),
    "theme:set event emitted"
);

const lockInput = document.querySelector(
    ".dk-panel__body > .dk-card:last-child input[type=checkbox]"
);
lockInput.checked = true;
lockInput.dispatchEvent(new window.Event("change", { bubbles: true }));
assert.equal(
    localStorage.getItem(ns + "panelLock"),
    "1",
    "panel lock stored in localStorage"
);
assert.ok(
    events.some((e) => e.type === "panel:lock" && e.data === true),
    "panel:lock event emitted"
);

panel.close();
assert.ok(
    document.querySelector(".dk-panel").classList.contains("open"),
    "panel remains open when locked"
);

lockInput.checked = false;
lockInput.dispatchEvent(new window.Event("change", { bubbles: true }));
panel.close();
assert.equal(
    document.querySelector(".dk-panel").classList.contains("open"),
    false,
    "panel closes when unlocked"
);

console.log("panel.spec.js passed");
