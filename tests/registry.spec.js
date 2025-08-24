import assert from "node:assert/strict";
import { createRegistry } from "../src/core/registry.js";
import { createBus } from "../src/core/bus.js";

globalThis.document = {
    querySelector() {
        return null;
    },
};

function createStorage() {
    const map = new Map();
    return {
        getJSON(key, def) {
            return map.has(key) ? JSON.parse(map.get(key)) : def;
        },
        setJSON(key, val) {
            map.set(key, JSON.stringify(val));
        },
    };
}

const bus = createBus();
const storage = createStorage();
const ns = "spec:";

const reg = createRegistry({ bus, storage, ns });

let inited = false;
let destroyed = false;

const tool = {
    id: "demo",
    name: "Demo",
    icon: "D",
    init() {
        inited = true;
    },
    destroy() {
        destroyed = true;
    },
};

reg.registerTool(tool);

// registration exposes tool through getAll
assert.deepEqual(reg.getAll(), [
    { id: "demo", name: "Demo", icon: "D", enabled: false },
]);

// enableTool triggers init and persists state
reg.enableTool("demo");
assert.equal(inited, true, "enableTool should call init");
assert.deepEqual(
    storage.getJSON(ns + "enabledTools", []),
    ["demo"],
    "enableTool should persist"
);

// disableTool triggers destroy and clears persistence
reg.disableTool("demo");
assert.equal(destroyed, true, "disableTool should call destroy");
assert.deepEqual(
    storage.getJSON(ns + "enabledTools", []),
    [],
    "disableTool should clear persistence"
);

// toggleTool toggles state
inited = false;
destroyed = false;
reg.toggleTool("demo");
assert.equal(inited, true, "toggleTool should enable when disabled");
reg.toggleTool("demo");
assert.equal(destroyed, true, "toggleTool should disable when enabled");

console.log("registry.spec.js passed");
