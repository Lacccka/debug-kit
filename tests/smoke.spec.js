import { test, expect } from "@playwright/test";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defaultTools } from "../src/tools/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

let server;
let baseUrl;

test.beforeAll(
    () =>
        new Promise((resolve) => {
            server = http.createServer((req, res) => {
                const filePath = path.join(
                    root,
                    req.url === "/" ? "/demo/index.html" : req.url
                );
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.statusCode = 404;
                        res.end("not found");
                        return;
                    }
                    if (filePath.endsWith(".js")) {
                        res.setHeader("Content-Type", "application/javascript");
                    }
                    if (filePath.endsWith(".css")) {
                        res.setHeader("Content-Type", "text/css");
                    }
                    res.end(data);
                });
            });
            server.listen(0, () => {
                const { port } = server.address();
                baseUrl = `http://localhost:${port}`;
                resolve();
            });
        })
);

test.afterAll(() => {
    server.close();
});

test("Alt+D opens panel with all tool cards", async ({ page }) => {
    await page.goto(`${baseUrl}/demo/index.html`);
    await page.keyboard.press("Alt+D");

    const panel = page.locator("#debugkit-host").locator(".dk-panel");
    await expect(panel).toHaveClass(/is-open/);

    const cards = panel.locator(".dk-grid .dk-card");
    await expect(cards).toHaveCount(defaultTools.length);
});
