// tools/logger/network.js — fetch/XHR proxy.

/**
 * Proxy fetch and XMLHttpRequest to log network requests.
 * @param {(log: object) => void} push Callback receiving log objects.
 * @returns {() => void} Cleanup function restoring originals.
 */
export function interceptNetwork(push) {
    const origFetch = window.fetch;
    window.fetch = async (input, init) => {
        const method = (init && init.method) || "GET";
        try {
            const res = await origFetch(input, init);
            push({
                type: "request",
                method,
                url: res.url || input,
                status: res.status,
            });
            return res;
        } catch (err) {
            push({
                type: "request",
                method,
                url: input,
                error: err && err.message,
            });
            throw err;
        }
    };
    const OrigXHR = window.XMLHttpRequest;
    function XHRProxy() {
        const xhr = new OrigXHR();
        let method = "GET";
        let url = "";
        const origOpen = xhr.open;
        xhr.open = function (m, u, ...rest) {
            method = m;
            url = u;
            origOpen.call(xhr, m, u, ...rest);
        };
        xhr.addEventListener("loadend", () => {
            push({ type: "request", method, url, status: xhr.status });
        });
        return xhr;
    }
    XHRProxy.prototype = OrigXHR.prototype;
    window.XMLHttpRequest = XHRProxy;
    return () => {
        window.fetch = origFetch;
        window.XMLHttpRequest = OrigXHR;
    };
}
