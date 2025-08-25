import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const root = path.dirname(url.fileURLToPath(import.meta.url));

const run = async (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await run(full);
        } else if (entry.name.endsWith(".spec.js")) {
            console.log(`Running ${path.relative(root, full)}`);
            await import(url.pathToFileURL(full));
        }
    }
};

await run(root);
