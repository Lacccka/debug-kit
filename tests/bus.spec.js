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

// off without handler removes all listeners for type
let multiCount = 0;
bus.on("multi", () => {
    multiCount++;
});
bus.on("multi", () => {
    multiCount++;
});
bus.emit("multi");
bus.off("multi");
bus.emit("multi");
assert.equal(
    multiCount,
    2,
    "off() without handler removes all listeners for type"
);

// clear removes all listeners
multiCount = 0;
bus.on("clear", () => {
    multiCount++;
});
bus.clear();
bus.emit("clear");
assert.equal(multiCount, 0, "clear() removes all listeners");

console.log("bus.spec.js passed");
