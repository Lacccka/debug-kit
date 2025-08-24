export function createRegistry({ bus, storage, ns }) {
    const registry = new Map();
    const enabled = new Set(storage.getJSON(ns + "enabledTools", []));
    function registerTool(def) {
        if (registry.has(def.id)) return;
        registry.set(def.id, def);
        if (enabled.has(def.id)) safeInit(def);
        bus.emit("registry:change", null);
    }
    function enableTool(id) {
        const def = registry.get(id);
        if (!def) return;
        if (!enabled.has(id)) {
            enabled.add(id);
            persist();
            safeInit(def);
            bus.emit("tool:state", { id, enabled: true });
            bus.emit("registry:change");
        }
    }
    function disableTool(id) {
        const def = registry.get(id);
        if (!def) return;
        if (enabled.has(id)) {
            enabled.delete(id);
            persist();
            try {
                def.destroy && def.destroy();
            } catch (e) {
                console.warn(e);
            }
            bus.emit("tool:state", { id, enabled: false });
            bus.emit("registry:change");
        }
    }
    function safeInit(def) {
        try {
            def.init && def.init(toolCtx(def.id));
        } catch (e) {
            console.warn("[tool init failed]", def.id, e);
        }
    }
    function toolCtx(id) {
        return {
            bus,
            shadowRoot: document.querySelector("#debugkit-host")?.shadowRoot,
            storage: {
                get: (k, d) =>
                    (storage.getJSON(ns + "tool:" + id + ":state", {}) || {})[
                        k
                    ] ?? d,
                set: (k, v) => {
                    const cur =
                        storage.getJSON(ns + "tool:" + id + ":state", {}) || {};
                    cur[k] = v;
                    storage.setJSON(ns + "tool:" + id + ":state", cur);
                },
            },
        };
    }
    function getState(id) {
        return storage.getJSON(ns + "tool:" + id + ":state", {}) || {};
    }
    function persist() {
        storage.setJSON(ns + "enabledTools", Array.from(enabled));
    }
    function autoload() {
        for (const id of enabled) {
            const def = registry.get(id);
            if (def) safeInit(def);
        }
    }
    function getAll() {
        return Array.from(registry.entries()).map(([id, def]) => ({
            id,
            name: def.name,
            icon: def.icon,
            enabled: enabled.has(id),
        }));
    }
    return {
        registerTool,
        enableTool,
        disableTool,
        getState,
        autoload,
        list: () => Array.from(registry.keys()),
        getAll,
    };
}
