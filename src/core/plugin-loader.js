export function loadPlugin(url) {
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
