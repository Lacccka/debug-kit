import assert from "node:assert/strict";
import http from "node:http";
import { JSDOM } from "jsdom";
import { loadPlugin } from "../src/core/plugin-loader.js";

const server = http.createServer((req, res) => {
    if (req.url === "/plugin.js") {
        res.setHeader("Content-Type", "application/javascript");
        res.end(
            "window.DebugKitPlugin = {id: 'mock', name: 'Mock', icon: 'M'};"
        );
    } else {
        res.statusCode = 404;
        res.end();
    }
});
await new Promise((resolve) => server.listen(0, resolve));
const port = server.address().port;
const url = `http://localhost:${port}/plugin.js`;

const dom = new JSDOM(
    "<!DOCTYPE html><html><head></head><body></body></html>",
    {
        resources: "usable",
        runScripts: "dangerously",
        url: "http://localhost/",
    }
);
const { window } = dom;
global.window = window;
global.document = window.document;

let registered = null;
global.DebugKit = {
    registerTool(tool) {
        registered = tool;
    },
};
window.DebugKit = global.DebugKit;

await loadPlugin(url);
assert.equal(registered?.id, "mock", "plugin should register tool");

server.close();
console.log("plugin-loader.spec.js passed");
