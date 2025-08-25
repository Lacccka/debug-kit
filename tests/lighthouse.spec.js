import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { LighthouseTool } from "../src/tools/lighthouse/index.js";

const dom = new JSDOM(
    '<!DOCTYPE html><html><body><div class="dk-hud-layer"></div></body></html>',
    { url: "http://localhost", pretendToBeVisual: true }
);
const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
global.innerWidth = window.innerWidth = 800;
global.innerHeight = window.innerHeight = 600;

const NS = "debugkit:v1:";

localStorage.setItem(NS + "lhUrl", "https://example.com");
localStorage.setItem(NS + "lhStrategy", "desktop");

let fetchedUrl = "";
global.fetch = async (url) => {
    fetchedUrl = url;
    return {
        json: async () => ({
            lighthouseResult: { categories: { performance: { score: 0.91 } } },
        }),
    };
};

const ctx = {
    shadowRoot: document,
    bus: { on: () => {}, emit: () => {} },
    ns: NS,
    storage: {
        get: () => {},
        set: () => {},
        getJSON: () => {},
        setJSON: () => {},
    },
};

LighthouseTool.init(ctx);

await new Promise((r) => setTimeout(r, 0));

assert.ok(
    fetchedUrl.startsWith("http://localhost/lighthouse?"),
    "should call local Lighthouse endpoint"
);
assert.ok(
    fetchedUrl.includes("strategy=desktop"),
    "should include strategy parameter"
);
assert.ok(!fetchedUrl.includes("key="), "should not include API key");

const text = document.querySelector(".dk-hud pre").textContent;
assert.equal(text, "Performance: 91", "should render performance score");

LighthouseTool.destroy();

console.log("lighthouse.spec.js passed");
