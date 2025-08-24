import assert from "node:assert/strict";
import { createBus } from "../src/core/bus.js";

const bus = createBus();

// on/emit delivers data
let payload;
const off = bus.on("test", (data) => {
    payload = data;
});
bus.emit("test", 123);
assert.equal(payload, 123, "on/emit should deliver data");

// off removes listener
payload = undefined;
off();
bus.emit("test", 456);
assert.equal(payload, undefined, "off should remove listener");

// once fires only once
let count = 0;
bus.once("once-event", () => {
    count++;
});
bus.emit("once-event");
bus.emit("once-event");
assert.equal(count, 1, "once should fire only once");

console.log("bus.spec.js passed");
