import assert from "node:assert/strict";
import { storage } from "../src/core/storage.js";

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

// set/getItem
storage.setItem("foo", "bar");
assert.equal(
    storage.getItem("foo"),
    "bar",
    "getItem should return stored value"
);

// default value when missing
assert.equal(
    storage.getItem("missing", "def"),
    "def",
    "getItem should return default for missing key"
);

// setJSON/getJSON
storage.setJSON("obj", { a: 1 });
assert.deepEqual(
    storage.getJSON("obj"),
    { a: 1 },
    "getJSON should parse stored JSON"
);

// remove
storage.remove("foo");
assert.equal(storage.getItem("foo", null), null, "remove should delete key");

// when localStorage throws, functions should not throw and return default
globalThis.localStorage = {
    getItem() {
        throw new Error("fail");
    },
    setItem() {
        throw new Error("fail");
    },
    removeItem() {
        throw new Error("fail");
    },
};

assert.equal(
    storage.getItem("k", "fallback"),
    "fallback",
    "getItem should return fallback on error"
);
assert.doesNotThrow(
    () => storage.setItem("k", "v"),
    "setItem should not throw on error"
);
assert.doesNotThrow(
    () => storage.remove("k"),
    "remove should not throw on error"
);
assert.deepEqual(
    storage.getJSON("k", { a: 1 }),
    { a: 1 },
    "getJSON should return default on error"
);
assert.doesNotThrow(
    () => storage.setJSON("k", { a: 1 }),
    "setJSON should not throw on error"
);

console.log("storage.spec.js passed");
