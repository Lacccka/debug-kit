import assert from "node:assert/strict";
import { storage } from "../src/core/storage.js";
import { versioning } from "../src/core/versioning.js";

// mock working localStorage
let map = new Map();
globalThis.localStorage = {
    getItem(key) {
        return map.has(key) ? map.get(key) : null;
    },
    setItem(key, val) {
        map.set(key, String(val));
    },
    removeItem(key) {
        map.delete(key);
    },
};

const ns = "test:";

versioning.init({ storage, ns });

const saved = storage.getJSON(ns + "__version__");
assert.equal(saved.major, 1, "__version__ should have major 1");

console.log("versioning.spec.js passed");
