// tools/layout-debug/cls-observer.js — обёртка PerformanceObserver.

export function createClsObserver(onEntry) {
    let total = 0;
    let observer = null;
    if (typeof PerformanceObserver !== "undefined") {
        try {
            observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.hadRecentInput) return;
                    total += entry.value;
                    onEntry && onEntry({ entry, value: total });
                });
            });
            observer.observe({ type: "layout-shift", buffered: true });
        } catch (e) {
            // ignore
        }
    }
    return {
        get() {
            return total;
        },
        reset() {
            total = 0;
        },
        disconnect() {
            observer && observer.disconnect();
        },
    };
}
