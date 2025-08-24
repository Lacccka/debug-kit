import assert from "node:assert/strict";
import { createClsObserver } from "../src/tools/layout-debug/cls-observer.js";

let poInstance;
class MockPO {
    constructor(cb) {
        this.cb = cb;
        poInstance = this;
    }
    observe() {}
    disconnect() {
        this.disconnected = true;
    }
}

globalThis.PerformanceObserver = MockPO;

let reported = 0;
const obs = createClsObserver(({ value }) => {
    reported = value;
});

poInstance.cb({
    getEntries: () => [{ value: 0.1, hadRecentInput: false }],
});
assert.equal(obs.get(), 0.1, "should accumulate CLS values");
assert.equal(reported, 0.1, "callback should receive cumulative value");

poInstance.cb({
    getEntries: () => [
        { value: 0.2, hadRecentInput: true },
        { value: 0.3, hadRecentInput: false },
    ],
});
assert.equal(obs.get(), 0.4, "should ignore entries with recent input");

obs.reset();
assert.equal(obs.get(), 0, "reset should clear value");

obs.disconnect();
assert.equal(
    poInstance.disconnected,
    true,
    "disconnect should call PerformanceObserver.disconnect"
);

console.log("cls-observer.spec.js passed");
