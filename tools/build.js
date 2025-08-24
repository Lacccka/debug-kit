// Небольшая заглушка сборки: на реальном проекте подключите esbuild/rollup.
// Здесь просто склеиваем src в один файл (очень грубо, для демонстрации подхода).
import fs from "fs";
import path from "path";

const outDir = "dist";
fs.mkdirSync(outDir, { recursive: true });
const banner = "(function(){\n";
const footer = "\n})();\n";
const entry = "src/index.js";
const src = fs.readFileSync(entry, "utf8");
fs.writeFileSync(
    path.join(outDir, "debugkit.js"),
    banner + src + footer,
    "utf8"
);
console.log("Wrote dist/debugkit.js (demo bundler).");
