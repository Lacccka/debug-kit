function supportsImport() {
    try {
        new Function("import('')");
        return true;
    } catch {
        return false;
    }
}

export async function loadPlugin(url) {
    if (supportsImport()) {
        try {
            const mod = await import(
                /* webpackIgnore: true */ /* @vite-ignore */ url
            );
            const tool = mod.default ?? Object.values(mod)[0];
            if (!tool) {
                throw new Error("Plugin did not export tool config");
            }
            window.DebugKit.registerTool(tool);
            return tool;
        } catch {
            /* fall through to script loader */
        }
    }
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.onload = () => {
            try {
                const tool = window.DebugKitPlugin;
                if (!tool) {
                    reject(new Error("Plugin did not provide DebugKitPlugin"));
                    return;
                }
                window.DebugKit.registerTool(tool);
                resolve(tool);
            } catch (e) {
                reject(e);
            } finally {
                delete window.DebugKitPlugin;
                script.remove();
            }
        };
        script.onerror = () => {
            script.remove();
            reject(new Error("Failed to load plugin"));
        };
        document.head.appendChild(script);
    });
}
