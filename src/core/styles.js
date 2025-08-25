// base-styles.js
import { BASE_CSS } from "./base-css.js";

export { BASE_CSS };

/**
 * Применяет базовые стили в теневой корень.
 * Работает как с adoptedStyleSheets, так и с fallback на <style>.
 */
export function attachBaseStyles(shadowRoot) {
    if (!shadowRoot) return;

    try {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(BASE_CSS);
        shadowRoot.adoptedStyleSheets = [
            ...shadowRoot.adoptedStyleSheets,
            sheet,
        ];
    } catch {
        const style = document.createElement("style");
        style.textContent = BASE_CSS;
        shadowRoot.appendChild(style);
    }
}
