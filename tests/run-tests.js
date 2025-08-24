import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const dir = path.dirname(url.fileURLToPath(import.meta.url));
for (const file of fs.readdirSync(dir)) {
    if (file.endsWith(".spec.js")) {
        console.log(`Running ${file}`);
        await import(url.pathToFileURL(path.join(dir, file)));
    }
}
