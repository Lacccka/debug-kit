// tools/logger/errors.js — window.onerror/unhandledrejection.

/**
 * Intercept global errors and unhandled promise rejections.
 * @param {(log: object) => void} push Callback receiving log objects.
 * @returns {() => void} Cleanup function restoring original handlers.
 */
export function interceptErrors(push) {
    const onError = (e) => {
        push({
            type: "error",
            message: e.message,
            source: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            stack: e.error && e.error.stack,
        });
    };
    const onRejection = (e) => {
        const reason = e.reason;
        push({
            type: "error",
            message:
                reason && typeof reason.message === "string"
                    ? reason.message
                    : String(reason),
            stack: reason && reason.stack,
            unhandled: true,
        });
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
        window.removeEventListener("error", onError);
        window.removeEventListener("unhandledrejection", onRejection);
    };
}
