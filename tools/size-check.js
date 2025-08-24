import fs from "fs";
import zlib from "zlib";

const p = "dist/debugkit.js";
const buf = fs.readFileSync(p);
const gz = zlib.gzipSync(buf);
console.log("Size:", buf.length, "bytes; gzipped:", gz.length, "bytes");
