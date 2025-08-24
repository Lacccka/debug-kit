// tools/perf-hud/counters.js — rAF и PerformanceObserver.
// Counts FPS via requestAnimationFrame, long tasks and JS heap usage.

export function createCounters({
    interval = 1000,
    raf = globalThis.requestAnimationFrame,
    caf = globalThis.cancelAnimationFrame,
    PerformanceObserver = globalThis.PerformanceObserver,
    performance = globalThis.performance,
    callback,
} = {}) {
    const state = { fps: 0, longTasks: 0, jsHeap: 0 };
    let frame = 0;
    let rafId = null;
    let timerId = null;
    let longTaskCount = 0;
    let observer = null;

    const loop = () => {
        frame++;
        rafId = raf(loop);
    };

    const collect = () => {
        state.fps = frame;
        frame = 0;
        state.longTasks = longTaskCount;
        longTaskCount = 0;
        state.jsHeap =
            performance && performance.memory
                ? performance.memory.usedJSHeapSize
                : 0;
        callback && callback({ ...state });
    };

    function start() {
        if (rafId) return;
        rafId = raf(loop);
        timerId = setInterval(collect, interval);
        if (PerformanceObserver) {
            observer = new PerformanceObserver((list) => {
                longTaskCount += list.getEntries().length;
            });
            try {
                observer.observe({ entryTypes: ["longtask"] });
            } catch (e) {
                observer = null;
            }
        }
        collect();
    }

    function stop() {
        if (rafId) {
            caf(rafId);
            rafId = null;
        }
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    return { start, stop, state };
}
