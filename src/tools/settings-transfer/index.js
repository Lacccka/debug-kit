export function exportSettings(ns) {
    const data = {};
    Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(ns)) {
            // Store keys without namespace prefix for compact JSON.
            data[k.slice(ns.length)] = localStorage.getItem(k);
        }
    });
    return JSON.stringify(data, null, 2);
}

export function importSettings(ns, json) {
    let data;
    try {
        data = JSON.parse(json);
    } catch {
        // Ignore malformed JSON input.
        return;
    }
    Object.entries(data).forEach(([k, v]) => {
        localStorage.setItem(ns + k, v);
    });
}
