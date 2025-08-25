import fs from "fs";
import esbuild from "esbuild";

const outFile = "dist/debugkit.js";
fs.mkdirSync("dist", { recursive: true });

try {
    await esbuild.build({
        entryPoints: ["src/index.js"],
        bundle: true,
        format: "iife",
        minify: true,
        sourcemap: true,
        outfile: outFile,
    });
    console.log(`Wrote ${outFile}.`);
} catch (err) {
    console.error(err);
    process.exit(1);
}
