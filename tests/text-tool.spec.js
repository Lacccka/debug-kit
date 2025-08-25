import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { buildClamp, getSelector } from "../src/tools/text-tool/utils.js";

const clamp = buildClamp({ min: 12, max: 24 });
assert.equal(
    clamp,
    "clamp(12px, 0.75rem + 0.12vw, 24px)",
    "buildClamp should create clamp expression"
);

const dom = new JSDOM(
    "<!DOCTYPE html><body><div id='root'><p class='a'></p><p></p></div></body>"
);
const { document } = dom.window;
const el = document.querySelector("#root > p:nth-of-type(2)");
const selector = getSelector(el);
assert.equal(
    selector,
    "#root > p:nth-of-type(2)",
    "getSelector should create unique selector"
);

console.log("text-tool.spec.js passed");
