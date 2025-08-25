import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";
import { loadPlugin } from "../src/core/plugin-loader.js";

const esmPath = path.join(process.cwd(), "tests", "mock-plugin.mjs");
fs.writeFileSync(
    esmPath,
    "export default {id: 'esm', name: 'ESM', icon: 'E'};"
);
const esmUrl = pathToFileURL(esmPath).href;

const server = http.createServer((req, res) => {
    if (req.url === "/plugin.js") {
        res.setHeader("Content-Type", "application/javascript");
        res.end(
            "window.DebugKitPlugin = {id: 'legacy', name: 'Legacy', icon: 'L'};"
        );
    } else {
        res.statusCode = 404;
        res.end();
    }
});
await new Promise((resolve) => server.listen(0, resolve));
const port = server.address().port;
const scriptUrl = `http://localhost:${port}/plugin.js`;

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

const esmTool = await loadPlugin(esmUrl);
assert.equal(esmTool?.id, "esm", "ESM plugin should load tool");

const scriptTool = await loadPlugin(scriptUrl);
assert.equal(scriptTool?.id, "legacy", "script plugin should load tool");

server.close();
fs.unlinkSync(esmPath);
console.log("plugin-loader.spec.js passed");
