import fs from "fs";
import esbuild from "esbuild";

// Build both browser (IIFE) and ESM bundles.
fs.mkdirSync("dist", { recursive: true });

const builds = [
    { file: "dist/debugkit.iife.js", format: "iife" },
    { file: "dist/debugkit.esm.js", format: "esm" },
];

try {
    await Promise.all(
        builds.map(({ file, format }) =>
            esbuild.build({
                entryPoints: ["src/index.js"],
                bundle: true,
                format,
                minify: true,
                sourcemap: true,
                outfile: file,
            })
        )
    );
    console.log("Wrote dist/debugkit.iife.js and dist/debugkit.esm.js.");
} catch (err) {
    console.error(err);
    process.exit(1);
}
