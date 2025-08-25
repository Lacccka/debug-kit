import { GuardTool } from "./guard/index.js";
import { GridOverlayTool } from "./grid-overlay/index.js";
import { LayoutDebugTool } from "./layout-debug/index.js";
import { PerfHudTool } from "./perf-hud/index.js";
import { LoggerTool } from "./logger/index.js";
import { InspectorTool } from "./inspector/index.js";
import { LighthouseTool } from "./lighthouse/index.js";
import { TextTool } from "./text-tool/index.js";

export const defaultTools = [
    GuardTool,
    GridOverlayTool,
    LayoutDebugTool,
    PerfHudTool,
    LoggerTool,
    InspectorTool,
    LighthouseTool,
    TextTool,
];
