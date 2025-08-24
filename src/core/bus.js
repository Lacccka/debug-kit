export function createBus() {
    const m = new Map();
    return {
        on(type, fn) {
            (m.get(type) || m.set(type, []).get(type)).push(fn);
            return () => this.off(type, fn);
        },
        once(type, fn) {
            const off = this.on(type, (d) => {
                off();
                fn(d);
            });
            return off;
        },
        off(type, fn) {
            const a = m.get(type) || [];
            const i = a.indexOf(fn);
            if (i > -1) a.splice(i, 1);
        },
        emit(type, data) {
            (m.get(type) || []).slice().forEach((fn) => {
                try {
                    fn(data);
                } catch (e) {
                    console.warn("[DebugKit bus err]", e);
                }
            });
        },
    };
}
