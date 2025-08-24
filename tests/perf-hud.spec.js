import assert from "node:assert/strict";
import { createCounters } from "../src/tools/perf-hud/counters.js";

// mock performance object with heap info
const perf = { memory: { usedJSHeapSize: 1048576 } };

// mock rAF loop
let rafCbs = [];
const raf = (cb) => {
    rafCbs.push(cb);
    return rafCbs.length;
};
const caf = () => {};
const runFrames = (n) => {
    for (let i = 0; i < n; i++) {
        const cbs = rafCbs;
        rafCbs = [];
        cbs.forEach((cb) => cb());
    }
};

// mock PerformanceObserver
let obsInstance = null;
class MockObserver {
    constructor(cb) {
        this.cb = cb;
        obsInstance = this;
    }
    observe() {}
    disconnect() {}
    emit(entries) {
        this.cb({ getEntries: () => entries });
    }
}

const counters = createCounters({
    interval: 50,
    raf,
    caf,
    PerformanceObserver: MockObserver,
    performance: perf,
});

counters.start();
runFrames(5);
obsInstance.emit([{}, {}]);
await new Promise((r) => setTimeout(r, 60));

assert.equal(counters.state.fps, 5, "fps should count frames");
assert.equal(counters.state.longTasks, 2, "longTasks should count entries");
assert.equal(counters.state.jsHeap, 1048576, "jsHeap should read heap size");

counters.stop();
console.log("perf-hud.spec.js passed");
