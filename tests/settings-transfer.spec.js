import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import {
    exportSettings,
    importSettings,
} from "../src/tools/settings-transfer/index.js";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost",
});
const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;

const NS = "debugkit:v1:";

localStorage.setItem(NS + "theme", "dark");
localStorage.setItem(NS + "panelLock", "1");
localStorage.setItem("other", "x");

const exported = exportSettings(NS);
assert.deepEqual(
    JSON.parse(exported),
    { theme: "dark", panelLock: "1" },
    "exportSettings should collect namespaced keys"
);

localStorage.setItem(NS + "theme", "light");
importSettings(NS, '{"theme":"dark","extra":"42"}');
assert.equal(
    localStorage.getItem(NS + "theme"),
    "dark",
    "importSettings should overwrite existing key"
);
assert.equal(
    localStorage.getItem(NS + "extra"),
    "42",
    "importSettings should add new key"
);
assert.equal(
    localStorage.getItem("other"),
    "x",
    "importSettings should not affect other namespaces"
);

console.log("settings-transfer.spec.js passed");
