import assert from "node:assert/strict";
import { interceptErrors } from "../src/tools/logger/errors.js";

const prev = global.window;
const listeners = {};
global.window = {
    addEventListener(type, cb) {
        (listeners[type] ||= []).push(cb);
    },
    removeEventListener(type, cb) {
        listeners[type] = (listeners[type] || []).filter((l) => l !== cb);
    },
    dispatchEvent(evt) {
        (listeners[evt.type] || []).forEach((cb) => cb(evt));
    },
};

const logs = [];
const off = interceptErrors((log) => logs.push(log));

window.dispatchEvent({
    type: "error",
    message: "boom",
    filename: "x.js",
    lineno: 1,
    colno: 2,
});
window.dispatchEvent({
    type: "unhandledrejection",
    reason: new Error("oops"),
});

off();

global.window = prev;
assert.equal(logs.length, 2, "should capture two events");
assert.equal(logs[0].message, "boom", "error message captured");
assert.equal(logs[1].message, "oops", "rejection message captured");

console.log("logger-errors.spec.js passed");
