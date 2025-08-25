const safe = (fn, fallback) => {
    try {
        return fn();
    } catch {
        return fallback;
    }
};

export const storage = {
    getItem(k, d) {
        return safe(() => localStorage.getItem(k), null) ?? d;
    },
    setItem(k, v) {
        return safe(() => localStorage.setItem(k, v), null);
    },
    getJSON(k, d) {
        return safe(() => JSON.parse(localStorage.getItem(k)), d);
    },
    setJSON(k, v) {
        return safe(() => localStorage.setItem(k, JSON.stringify(v)), null);
    },
    remove(k) {
        return safe(() => localStorage.removeItem(k), null);
    },
};
