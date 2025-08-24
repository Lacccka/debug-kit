// src/index.js — вход проекта: инициализация ядра и регистрация инструментов
// В реальном билде это собирается в dist/debugkit.js (IIFE/UMD).

import { createHost } from "./core/host.js";
import { createBus } from "./core/bus.js";
import { storage } from "./core/storage.js";
import { setupGestures } from "./core/gestures.js";
import { setupListeners } from "./core/listeners.js";
import { createRegistry } from "./core/registry.js";
import { attachBaseStyles } from "./core/styles.js";
import { versioning } from "./core/versioning.js";
import { createPanel } from "./ui/panel/panel.js";

import { GuardTool } from "./tools/guard/index.js";

const ns = "debugkit:v1:";

(function initDebugKit() {
    const host = createHost();
    const bus = createBus();
    const reg = createRegistry({ bus, storage, ns });
    const shadowRoot = host.shadowRoot;

    attachBaseStyles(shadowRoot);

    const panel = createPanel({ bus, registry: reg, storage, shadowRoot, ns });

    setupListeners({ bus });
    versioning.init({ storage, ns });

    setupGestures({ bus, togglePanel: () => panel.toggle() });
    // Панель-лаунчер

    // Глобальный экспорт для регистраций инструментов
    window.DebugKit = {
        registerTool: reg.registerTool,
        enableTool: reg.enableTool,
        disableTool: reg.disableTool,
        toggleTool: reg.toggleTool,
        getState: reg.getState,
        bus,
    };

    reg.registerTool(GuardTool);

    // Автовключение ранее активных инструментов
    reg.autoload();
})();
