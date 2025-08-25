# Debug-Kit

Универсальный инструмент для фронтенд-разработки и отладки.  
Можно быстро подключить к любому сайту (свой, чужой, тестовый).

## 🛠 Установка

```bash
git clone https://github.com/your-org/debug-kit.git
cd debug-kit
npm install
```

## 🔧 Сборка и тесты

```bash
npm run build
npm test
npm run size
```

## 🔌 Подключение на страницу

### ESM

```js
import "./dist/debugkit.js";

DebugKit.enableTool("guard");
```

### Script

```html
<script src="/dist/debugkit.js"></script>
<script>
    DebugKit.enableTool("guard");
</script>
```

---

## ✨ Возможности

-   Работает одинаково на **desktop** и **mobile**.
-   Панель запуска инструментов (Alt+D или плавающий тогглер).
-   Единый шаблон HUD: drag, snap к краям, сворачивание в «пилюлю», сохранение позиции.
-   Лёгкое расширение новыми модулями.
-   Shadow DOM — изоляция стилей.
-   Настройки и состояния сохраняются в `localStorage`.

---

## 📦 Архитектура

### Ядро

-   Контейнер в Shadow DOM (`#debugkit-host`).
-   Управление:
    -   реестр инструментов,
    -   включение/выключение,
    -   хранение состояния,
    -   глобальные слушатели (`resize`, `scroll`, `visualViewport`).
-   API:
    ```js
    DebugKit.registerTool({id, name, icon, init, destroy, ...});
    DebugKit.enableTool(id);
    DebugKit.disableTool(id);
    DebugKit.toggleTool(id);
    DebugKit.getState(id);
    DebugKit.bus.emit(event, data);
    DebugKit.bus.on(event, fn);
    ```

### Панель (Launcher)

-   Выезжающее окно с инструментами.
-   Шапка: заголовок + поиск.
-   Сетка карточек с тумблерами on/off.
-   Глобальные настройки (сброс, тема light/dark/auto, блокировка панели).

### HUD

-   Карточка 240–320 px.
-   Шапка: иконка, название, drag-handle, кнопки (minimize/pin/settings/close).
-   Поведение:
    -   draggable мышью/тачем,
    -   snap к краям,
    -   запоминание позиции,
    -   свернуть в «пилюлю»,
    -   ограничение размера на мобиле ≤⅓ экрана.

### Event bus

-   Централизованные события:
    -   `viewport:change` – изменение размеров окна или масштаба.
    -   `zoom:change` – изменение `visualViewport.scale`.
    -   `scrollbar:change` – появление или исчезновение скроллбаров.
    -   `theme:change` – смена темы (системная или из панели).
    -   `panel:lock` – состояние блокировки панели.
    -   `tool:state`
    -   `registry:change`

---

## 🛠 Инструменты (MVP)

-   **Guard** (готово)
    -   HUD: `viewport`, `scale`.
    -   Кнопка «Overflow scan» (подсветка переполненных элементов).
-   **Layout Debug**
    -   CLS, количество сдвигов, подсветка shift/overflow.
-   **Grid Overlay**
    -   Сетка: колонки, gutter, baseline.
-   **Perf HUD**
    -   FPS, long tasks, JS heap.
-   **Logger**
    -   Ошибки (`onerror`, `unhandledrejection`).
    -   Сеть (fetch/xhr).

---

## ⚙️ Нефункциональные требования

-   Чистый JS + CSS, без зависимостей.
-   Fail-safe: ошибка модуля не ломает панель.
-   Минимальное влияние на перфоманс (throttling).
-   Современные браузеры (Chrome, Edge, Safari, Firefox).
-   Размер ядра + базовых модулей `< 50 KB gz`.

---

## 💾 Хранение состояния

В `localStorage` (с ключами `debugkit:v1:*`):

-   включённые инструменты,
-   позиции HUD,
-   настройки каждого модуля,
-   тема панели.

Версионирование ключей позволяет легко сбрасывать настройки при обновлениях.

---

## 🎨 UI/UX

-   Shadow DOM — стили не пересекаются с сайтом.
-   Автотема (light/dark) + ручной переключатель.
-   Плавные анимации.
-   Минимизация HUD в «пилюлю».
-   Tooltip при наведении на кнопки.

---

## ⌨️ Горячие клавиши / жесты

-   Desktop: **Alt+D**.
-   Mobile:
    -   triple-tap (правый нижний угол),
    -   long-tap hotspot (8×8 px, левый верхний угол),
    -   `#debug` в URL.

---

## 🔮 Будущее расширение

-   Экспорт/импорт настроек (JSON).
-   Плагины (подключаемые из CDN).
-   Inspector (подсветка DOM под курсором).
-   Интеграция с Lighthouse API.

---

## ✅ Тестирование

Тестировать на:

-   Desktop: Chrome, Firefox, Safari.
-   Mobile: Chrome/Android, Safari/iOS.

Проверка:

-   корректность хоткеев/жестов,
-   включение/выключение каждого модуля,
-   сохранение позиций HUD,
-   работа при ошибках модуля,
-   кликабельность панели и HUD.

---
