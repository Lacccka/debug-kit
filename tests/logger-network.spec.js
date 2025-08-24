import assert from "node:assert/strict";
import { interceptNetwork } from "../src/tools/logger/network.js";

const prev = global.window;
class XhrMock {
    constructor() {
        this._listeners = {};
        this.status = 200;
    }
    open(m, u) {
        this.method = m;
        this.url = u;
    }
    send() {
        const cb = this._listeners.loadend;
        cb && cb();
    }
    addEventListener(t, cb) {
        this._listeners[t] = cb;
    }
}
const fetchMock = async (url, init) => ({ status: 201, url, ...init });

global.window = {
    fetch: fetchMock,
    XMLHttpRequest: XhrMock,
};

const logs = [];
const restore = interceptNetwork((log) => logs.push(log));

await window.fetch("/api");
const xhr = new window.XMLHttpRequest();
xhr.open("POST", "/data");
xhr.send();

restore();
global.window = prev;

assert.equal(logs.length, 2, "should log fetch and xhr");
assert.equal(logs[0].url, "/api", "fetch url logged");
assert.equal(logs[0].status, 201, "fetch status logged");
assert.equal(logs[1].method, "POST", "xhr method logged");
assert.equal(logs[1].url, "/data", "xhr url logged");

console.log("logger-network.spec.js passed");
