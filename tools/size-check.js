import fs from "fs";
import zlib from "zlib";

const files = ["dist/debugkit.iife.js", "dist/debugkit.esm.js"];

for (const p of files) {
    const buf = fs.readFileSync(p);
    const gz = zlib.gzipSync(buf);
    console.log(
        `Size (${p}):`,
        buf.length,
        "bytes; gzipped:",
        gz.length,
        "bytes"
    );
}
